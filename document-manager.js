const DocumentManager = (() => {
  const DB_NAME = 'RoboticsLearningDocuments';
  const DB_VERSION = 1;
  const STORE_NAME = 'documents';
  const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
  const MIN_TEXT_LENGTH_FOR_SUCCESS = 40;
  const MIN_TEXT_LENGTH_FOR_GENERATION = 120;
  const SNIPPET_LENGTH = 160;
  const PDF_WORKER_URL = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.10.377/pdf.worker.min.js';
  const DEFAULT_UPLOAD_MESSAGE = '拖拽文件到此处或点击上传';

  const STATUS_CONFIG = {
    processing: { label: '解析中', className: 'processing' },
    ready: { label: '已就绪', className: 'ready' },
    error: { label: '解析失败', className: 'error' },
    pending: { label: '待处理', className: 'pending' }
  };

  const SUPPORTED_FILES = [
    {
      category: 'markdown',
      label: 'Markdown',
      icon: '✍️',
      extensions: ['.md', '.markdown'],
      mimeTypes: ['text/markdown', 'text/x-markdown'],
      source: 'markdown'
    },
    {
      category: 'text',
      label: '纯文本',
      icon: '📄',
      extensions: ['.txt', '.text', '.log'],
      mimeTypes: ['text/plain'],
      source: 'plain-text'
    },
    {
      category: 'pdf',
      label: 'PDF',
      icon: '📕',
      extensions: ['.pdf'],
      mimeTypes: ['application/pdf'],
      source: 'pdf'
    },
    {
      category: 'docx',
      label: 'Word',
      icon: '📝',
      extensions: ['.docx'],
      mimeTypes: ['application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
      source: 'docx'
    },
    {
      category: 'zip',
      label: 'ZIP',
      icon: '🗜️',
      extensions: ['.zip'],
      mimeTypes: ['application/zip', 'application/x-zip-compressed'],
      source: 'zip'
    }
  ];

  const CATEGORY_BY_EXTENSION = new Map();
  const CATEGORY_BY_MIME = new Map();

  SUPPORTED_FILES.forEach((definition) => {
    definition.extensions.forEach((ext) => CATEGORY_BY_EXTENSION.set(ext, definition));
    definition.mimeTypes.forEach((mime) => CATEGORY_BY_MIME.set(mime, definition));
  });

  const DEFAULT_ICON = '📎';
  const DEFAULT_CATEGORY_LABEL = '其他';

  let db = null;
  let currentDocument = null;
  let pdfWorkerReady = false;
  let uploadMessageTimer = null;

  const state = {
    documents: [],
    selectedId: null,
    search: '',
    filter: ''
  };

  const elements = {
    grid: null,
    count: null,
    uploadArea: null,
    selectBtn: null,
    input: null,
    searchInput: null,
    filterSelect: null,
    downloadBtn: null,
    deleteBtn: null,
    copyBtn: null,
    generateBtn: null,
    clearBtn: null,
    previewTitle: null,
    previewMeta: null,
    preview: null,
    ocrContent: null
  };

  const DocumentStore = {
    async save(doc) {
      if (!db) await initDatabase();
      return new Promise((resolve, reject) => {
        const transaction = db.transaction([STORE_NAME], 'readwrite');
        const store = transaction.objectStore(STORE_NAME);
        const request = store.put(doc);
        request.onsuccess = () => resolve(doc);
        request.onerror = () => reject(request.error);
      });
    },

    async getAll() {
      if (!db) await initDatabase();
      return new Promise((resolve, reject) => {
        const transaction = db.transaction([STORE_NAME], 'readonly');
        const store = transaction.objectStore(STORE_NAME);
        const request = store.getAll();
        request.onsuccess = () => resolve(request.result || []);
        request.onerror = () => reject(request.error);
      });
    },

    async delete(id) {
      if (!db) await initDatabase();
      return new Promise((resolve, reject) => {
        const transaction = db.transaction([STORE_NAME], 'readwrite');
        const store = transaction.objectStore(STORE_NAME);
        const request = store.delete(id);
        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
      });
    },

    async clear() {
      if (!db) await initDatabase();
      return new Promise((resolve, reject) => {
        const transaction = db.transaction([STORE_NAME], 'readwrite');
        const store = transaction.objectStore(STORE_NAME);
        const request = store.clear();
        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
      });
    }
  };

  async function init() {
    try {
      collectElements();
      bindEvents();
      await initDatabase();
      await refreshDocumentsFromStore();
      setUploadAreaMessage(DEFAULT_UPLOAD_MESSAGE);

      if (state.documents.length > 0) {
        currentDocument = state.documents[0];
        state.selectedId = currentDocument.id;
      }

      await renderDocuments();
      if (currentDocument) {
        renderPreview();
      } else {
        resetPreview();
      }
    } catch (error) {
      console.error('Error initializing DocumentManager:', error);
      if (elements.grid) {
        elements.grid.innerHTML = `
          <div class="documents-error">
            <p>❌ 文档中心初始化失败：${escapeHtml(error.message || '未知错误')}</p>
          </div>
        `;
      }
      throw error;
    }
  }

  function initDatabase() {
    if (db) return Promise.resolve(db);
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);
      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        db = request.result;
        resolve(db);
      };
      request.onupgradeneeded = (event) => {
        const database = event.target.result;
        if (!database.objectStoreNames.contains(STORE_NAME)) {
          const store = database.createObjectStore(STORE_NAME, { keyPath: 'id' });
          store.createIndex('name', 'name', { unique: false });
          store.createIndex('type', 'type', { unique: false });
          store.createIndex('uploadDate', 'uploadDate', { unique: false });
        }
      };
    });
  }

  function collectElements() {
    elements.grid = document.getElementById('documentsGrid');
    elements.count = document.getElementById('documentsCount');
    elements.uploadArea = document.getElementById('uploadArea');
    elements.selectBtn = document.getElementById('selectFilesBtn');
    elements.input = document.getElementById('documentInput');
    elements.searchInput = document.getElementById('documentSearch');
    elements.filterSelect = document.getElementById('documentTypeFilter');
    elements.downloadBtn = document.getElementById('downloadDocument');
    elements.deleteBtn = document.getElementById('deleteDocument');
    elements.copyBtn = document.getElementById('copyOcrText');
    elements.generateBtn = document.getElementById('generateQuestionsBtn');
    elements.clearBtn = document.getElementById('clearAllDocuments');
    elements.previewTitle = document.getElementById('previewTitle');
    elements.previewMeta = document.getElementById('previewMeta');
    elements.preview = document.getElementById('documentPreview');
    elements.ocrContent = document.getElementById('ocrContent');
  }

  function bindEvents() {
    if (elements.selectBtn) {
      elements.selectBtn.addEventListener('click', (event) => {
        event.preventDefault();
        elements.input?.click();
      });
    }

    if (elements.uploadArea) {
      elements.uploadArea.addEventListener('click', (event) => {
        if (event.target.closest('#selectFilesBtn')) return;
        elements.input?.click();
      });

      ['dragenter', 'dragover'].forEach((eventName) => {
        elements.uploadArea.addEventListener(eventName, (event) => {
          event.preventDefault();
          event.stopPropagation();
          elements.uploadArea.classList.add('drag-over');
        });
      });

      ['dragleave', 'drop'].forEach((eventName) => {
        elements.uploadArea.addEventListener(eventName, (event) => {
          event.preventDefault();
          event.stopPropagation();
          if (eventName === 'dragleave' && event.target !== elements.uploadArea) {
            return;
          }
          elements.uploadArea.classList.remove('drag-over');
          if (eventName === 'drop') {
            const files = Array.from(event.dataTransfer?.files || []);
            handleFileSelection(files);
          }
        });
      });
    }

    if (elements.input) {
      elements.input.addEventListener('change', (event) => {
        const files = Array.from(event.target.files || []);
        handleFileSelection(files);
        event.target.value = '';
      });
    }

    if (elements.searchInput) {
      elements.searchInput.addEventListener('input', (event) => {
        state.search = (event.target.value || '').trim().toLowerCase();
        renderDocuments();
      });
    }

    if (elements.filterSelect) {
      elements.filterSelect.addEventListener('change', (event) => {
        state.filter = event.target.value || '';
        renderDocuments();
      });
    }

    if (elements.downloadBtn) {
      elements.downloadBtn.addEventListener('click', downloadCurrentDocument);
    }

    if (elements.deleteBtn) {
      elements.deleteBtn.addEventListener('click', deleteCurrentDocument);
    }

    if (elements.copyBtn) {
      elements.copyBtn.addEventListener('click', copyCurrentText);
    }

    if (elements.generateBtn) {
      elements.generateBtn.addEventListener('click', generateQuestionsFromDocument);
    }

    if (elements.clearBtn) {
      elements.clearBtn.addEventListener('click', clearAllDocuments);
    }

    const retryHandler = (event) => {
      const button = event.target.closest('[data-action="retry-document"]');
      if (button) {
        reprocessCurrentDocument();
      }
    };

    elements.preview?.addEventListener('click', retryHandler);
    elements.ocrContent?.addEventListener('click', retryHandler);
  }

  async function handleFileSelection(fileList) {
    const files = Array.isArray(fileList) ? fileList : Array.from(fileList || []);
    if (!files.length) return;

    const { valid, errors } = validateFiles(files);

    if (errors.length) {
      alert(`以下文件无法上传：\n${errors.join('\n')}`);
    }

    if (!valid.length) {
      toggleUploadAreaUploading(false);
      setUploadAreaMessage(DEFAULT_UPLOAD_MESSAGE);
      return;
    }

    toggleUploadAreaUploading(true);

    const results = {
      success: 0,
      failure: []
    };

    for (let i = 0; i < valid.length; i++) {
      const { file, definition } = valid[i];
      setUploadAreaMessage(`正在解析 ${file.name} (${i + 1}/${valid.length})`);
      const processed = await processFile(file, definition);
      if (processed.status === 'error') {
        results.failure.push({
          name: file.name,
          message: processed.errorMessage || '解析失败'
        });
      } else {
        results.success += 1;
      }
    }

    toggleUploadAreaUploading(false);

    if (results.failure.length === 0) {
      setUploadAreaMessage(`✓ 成功解析 ${results.success} 个文档`, true);
    } else if (results.success === 0) {
      setUploadAreaMessage('未成功解析任何文档', true);
    } else {
      setUploadAreaMessage(`解析完成，成功 ${results.success} 个`, true);
    }

    if (results.failure.length > 0) {
      const message = results.failure.map((item) => `• ${item.name}: ${item.message}`).join('\n');
      alert(`部分文件解析失败：\n${message}`);
    }

    await renderDocuments();
    if (currentDocument) {
      renderPreview();
    } else {
      resetPreview();
    }
  }

  function validateFiles(files) {
    const valid = [];
    const errors = [];

    files.forEach((file) => {
      if (!file) return;
      const definition = detectDefinition(file);
      if (!definition) {
        errors.push(`"${file.name}" 的文件类型暂不支持`);
        return;
      }
      if (file.size > MAX_FILE_SIZE) {
        errors.push(`"${file.name}" 超过 10MB 大小限制`);
        return;
      }
      valid.push({ file, definition });
    });

    return { valid, errors };
  }

  function detectDefinition(fileOrInfo) {
    if (!fileOrInfo) return null;
    const name = (fileOrInfo.name || '').toLowerCase();
    const type = (fileOrInfo.type || '').toLowerCase();
    const extension = getExtension(name);

    if (extension && CATEGORY_BY_EXTENSION.has(extension)) {
      return CATEGORY_BY_EXTENSION.get(extension);
    }

    if (type && CATEGORY_BY_MIME.has(type)) {
      return CATEGORY_BY_MIME.get(type);
    }

    if (extension && CATEGORY_BY_EXTENSION.has(extension)) {
      return CATEGORY_BY_EXTENSION.get(extension);
    }

    return null;
  }

  function createDocumentRecord(file, definition) {
    const now = Date.now();
    const extension = getExtension(file.name);
    return {
      id: generateId(),
      name: file.name,
      type: file.type || (definition?.mimeTypes?.[0] || ''),
      category: definition?.category || normalizeCategory(extension),
      extension,
      size: file.size,
      uploadDate: now,
      updatedAt: now,
      status: 'processing',
      textContent: '',
      textSource: definition?.source || 'unknown',
      meta: {},
      errorMessage: '',
      dataUrl: ''
    };
  }

  function normalizeCategory(category) {
    if (!category) return null;
    const value = category.toString().toLowerCase();
    if (value === 'md' || value === 'markdown') return 'markdown';
    if (value === 'txt' || value === 'text' || value === 'plain') return 'text';
    if (value === 'pdf') return 'pdf';
    if (value === 'doc' || value === 'docx' || value === 'word') return 'docx';
    if (value === 'zip' || value === 'compressed') return 'zip';
    return value;
  }

  function normalizeDocument(rawDoc) {
    if (!rawDoc || typeof rawDoc !== 'object') return null;

    const normalized = { ...rawDoc };

    if (normalized.ocrText && !normalized.textContent) {
      normalized.textContent = normalized.ocrText;
    }

    if (normalized.data && !normalized.dataUrl) {
      normalized.dataUrl = normalized.data;
    }

    if (normalized.analysis && !normalized.meta) {
      normalized.meta = normalized.analysis;
    }

    normalized.category = normalizeCategory(normalized.category) || normalizeCategory(normalized.type);
    normalized.extension = normalized.extension || getExtension(normalized.name || '');
    normalized.type = normalized.type || '';
    normalized.status = normalized.status || (normalized.textContent ? 'ready' : 'processing');
    normalized.errorMessage = normalized.errorMessage || '';
    normalized.uploadDate = normalized.uploadDate || normalized.createdAt || Date.now();
    normalized.updatedAt = normalized.updatedAt || normalized.uploadDate;

    return normalized;
  }

  function inferCategory(doc) {
    const extension = doc.extension || getExtension(doc.name || '');
    if (extension && CATEGORY_BY_EXTENSION.has(extension)) {
      return CATEGORY_BY_EXTENSION.get(extension).category;
    }
    if (doc.type && CATEGORY_BY_MIME.has(doc.type)) {
      return CATEGORY_BY_MIME.get(doc.type).category;
    }
    return 'other';
  }

  function getDefinitionFromDoc(doc) {
    if (!doc) return null;
    const normalizedCategory = normalizeCategory(doc.category);
    if (normalizedCategory) {
      const definition = SUPPORTED_FILES.find((item) => item.category === normalizedCategory);
      if (definition) return definition;
    }
    const extension = doc.extension || getExtension(doc.name || '');
    if (extension && CATEGORY_BY_EXTENSION.has(extension)) {
      return CATEGORY_BY_EXTENSION.get(extension);
    }
    if (doc.type && CATEGORY_BY_MIME.has(doc.type)) {
      return CATEGORY_BY_MIME.get(doc.type);
    }
    return null;
  }

  function createStorePayload(doc) {
    return {
      id: doc.id,
      name: doc.name,
      type: doc.type,
      category: doc.category,
      extension: doc.extension,
      size: doc.size,
      uploadDate: doc.uploadDate,
      updatedAt: doc.updatedAt,
      status: doc.status,
      textContent: doc.textContent,
      textSource: doc.textSource,
      meta: doc.meta ? { ...doc.meta } : null,
      errorMessage: doc.errorMessage || '',
      dataUrl: doc.dataUrl || ''
    };
  }

  function enrichDocument(doc) {
    if (!doc) return null;

    const normalizedCategory = normalizeCategory(doc.category) || inferCategory(doc);
    const definition = SUPPORTED_FILES.find((item) => item.category === normalizedCategory) || null;

    const enriched = {
      ...doc,
      category: normalizedCategory,
      categoryLabel: definition ? definition.label : DEFAULT_CATEGORY_LABEL,
      icon: definition ? definition.icon : DEFAULT_ICON,
      extension: doc.extension || getExtension(doc.name || ''),
      textContent: typeof doc.textContent === 'string' ? doc.textContent : '',
      textSource: doc.textSource || (definition ? definition.source : 'unknown'),
      errorMessage: doc.errorMessage || ''
    };

    enriched.meta = doc.meta ? { ...doc.meta } : {};
    const text = enriched.textContent || '';
    const charCount = text.length;

    if (charCount > 0) {
      enriched.meta.charCount = typeof enriched.meta.charCount === 'number' ? enriched.meta.charCount : charCount;
      enriched.meta.lineCount = typeof enriched.meta.lineCount === 'number' ? enriched.meta.lineCount : countLines(text);
      const wordCount = countWords(text);
      enriched.meta.wordCount = typeof enriched.meta.wordCount === 'number' ? enriched.meta.wordCount : wordCount;
      const readingMinutes = calculateReadingMinutes(enriched.meta.wordCount, enriched.meta.charCount);
      if (readingMinutes > 0 && typeof enriched.meta.readingMinutes !== 'number') {
        enriched.meta.readingMinutes = readingMinutes;
      }
    }

    if (!STATUS_CONFIG[enriched.status]) {
      enriched.status = text ? 'ready' : (enriched.errorMessage ? 'error' : 'processing');
    }

    enriched.textPreview = text ? createSnippet(text) : '';
    enriched.searchIndex = (enriched.name + ' ' + enriched.textPreview).toLowerCase();

    return enriched;
  }

  async function refreshDocumentsFromStore() {
    const storedDocs = await DocumentStore.getAll();
    const enrichedDocs = storedDocs
      .map(normalizeDocument)
      .filter(Boolean)
      .map(enrichDocument)
      .sort((a, b) => (b.uploadDate || 0) - (a.uploadDate || 0));
    state.documents = enrichedDocs;
    if (state.selectedId) {
      const selected = enrichedDocs.find((doc) => doc.id === state.selectedId);
      currentDocument = selected || null;
      if (!selected) {
        state.selectedId = null;
      }
    } else {
      currentDocument = null;
    }
  }

  async function saveAndSyncDocument(doc) {
    const payload = createStorePayload(doc);
    await DocumentStore.save(payload);
    const enriched = enrichDocument(payload);
    updateStateDocument(enriched);
    return enriched;
  }

  function updateStateDocument(doc) {
    const index = state.documents.findIndex((item) => item.id === doc.id);
    if (index === -1) {
      state.documents.push(doc);
    } else {
      state.documents[index] = doc;
    }
    state.documents.sort((a, b) => (b.uploadDate || 0) - (a.uploadDate || 0));
    if (state.selectedId === doc.id) {
      currentDocument = doc;
    }
    return doc;
  }

  function removeDocumentFromState(id) {
    state.documents = state.documents.filter((doc) => doc.id !== id);
    if (state.selectedId === id) {
      state.selectedId = null;
      currentDocument = null;
    }
  }

  async function processFile(file, definition, existingDoc = null) {
    const effectiveDefinition = definition || getDefinitionFromDoc(existingDoc) || detectDefinition(file);
    if (!effectiveDefinition) {
      throw new Error('文件类型不受支持');
    }

    const baseRecord = existingDoc
      ? { ...createStorePayload(existingDoc), uploadDate: existingDoc.uploadDate }
      : createDocumentRecord(file, effectiveDefinition);

    let record = enrichDocument({
      ...baseRecord,
      status: 'processing',
      errorMessage: '',
      updatedAt: Date.now()
    });

    record = await saveAndSyncDocument(record);
    await renderDocuments();

    const dataUrlPromise = readFileAsDataUrl(file);

    try {
      const extraction = await extractTextByDefinition(file, effectiveDefinition);
      record.textContent = normalizeText(extraction.text);
      record.textSource = extraction.source || effectiveDefinition.source;
      record.meta = buildMeta(record, extraction.meta, record.textContent);
      record.status = record.textContent && record.textContent.length >= MIN_TEXT_LENGTH_FOR_SUCCESS ? 'ready' : 'error';
      record.errorMessage = record.status === 'ready' ? '' : '未提取到足够的文字内容';
      record.dataUrl = await dataUrlPromise;
      record.updatedAt = Date.now();
    } catch (error) {
      console.error(`Failed to process ${file.name}:`, error);
      record.textContent = '';
      record.meta = {};
      record.status = 'error';
      record.errorMessage = error.message || '文档解析失败';
      record.dataUrl = record.dataUrl || await dataUrlPromise.catch(() => record.dataUrl || '');
      record.updatedAt = Date.now();
    }

    record = await saveAndSyncDocument(record);
    await renderDocuments();

    if (!currentDocument || state.selectedId === record.id) {
      currentDocument = record;
      state.selectedId = record.id;
      renderPreview();
    }

    return record;
  }

  function readFileAsDataUrl(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = () => reject(new Error('文件读取失败'));
      reader.readAsDataURL(file);
    });
  }

  function buildMeta(doc, extractedMeta = {}, text = '') {
    const meta = {
      ...(doc.meta || {}),
      ...(extractedMeta || {})
    };

    const normalizedText = text || '';
    const charCount = normalizedText.length;
    meta.charCount = typeof meta.charCount === 'number' ? meta.charCount : charCount;
    meta.lineCount = typeof meta.lineCount === 'number' ? meta.lineCount : countLines(normalizedText);
    const wordCount = countWords(normalizedText);
    meta.wordCount = typeof meta.wordCount === 'number' ? meta.wordCount : wordCount;
    const readingMinutes = calculateReadingMinutes(meta.wordCount, meta.charCount);
    if (readingMinutes > 0 && typeof meta.readingMinutes !== 'number') {
      meta.readingMinutes = readingMinutes;
    }

    if (Array.isArray(meta.warnings)) {
      meta.warnings = meta.warnings.filter(Boolean);
    }

    return meta;
  }

  function toggleUploadAreaUploading(isUploading) {
    if (!elements.uploadArea) return;
    elements.uploadArea.classList.toggle('uploading', Boolean(isUploading));
    if (!isUploading) {
      elements.uploadArea.classList.remove('drag-over');
    }
  }

  function setUploadAreaMessage(message, temporary = false, duration = 3200) {
    if (!elements.uploadArea) return;
    const uploadText = elements.uploadArea.querySelector('.upload-text');
    if (!uploadText) return;
    uploadText.textContent = message;
    if (uploadMessageTimer) {
      clearTimeout(uploadMessageTimer);
      uploadMessageTimer = null;
    }
    if (temporary) {
      uploadMessageTimer = setTimeout(() => {
        uploadText.textContent = DEFAULT_UPLOAD_MESSAGE;
      }, duration);
    }
  }

  async function renderDocuments() {
    if (!elements.grid) return;

    if (elements.count) {
      elements.count.textContent = state.documents.length;
    }

    const documents = getFilteredDocuments();

    if (documents.length === 0) {
      const message = state.search || state.filter ? '未找到匹配的文档' : '暂无文档，点击上方按钮上传';
      elements.grid.innerHTML = `
        <div class="documents-empty">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"></path>
            <polyline points="13 2 13 9 20 9"></polyline>
          </svg>
          <p>${escapeHtml(message)}</p>
        </div>
      `;
      if (!state.search && !state.filter) {
        resetPreview();
      }
      updateActionButtons(null);
      return;
    }

    if (!documents.some((doc) => doc.id === state.selectedId)) {
      const firstDoc = documents[0];
      state.selectedId = firstDoc.id;
      currentDocument = firstDoc;
      renderPreview();
    }

    elements.grid.innerHTML = documents.map(renderDocumentCard).join('');

    elements.grid.querySelectorAll('.document-card').forEach((card) => {
      card.addEventListener('click', () => {
        const docId = card.dataset.docId;
        setCurrentDocument(docId);
      });
    });

    highlightSelectedCard();
    updateActionButtons(currentDocument);
  }

  function getFilteredDocuments() {
    const search = state.search;
    const filter = state.filter;
    return state.documents.filter((doc) => {
      const matchesFilter = !filter ||
        (filter === 'other'
          ? !SUPPORTED_FILES.some((item) => item.category === doc.category)
          : doc.category === filter);
      const matchesSearch = !search || doc.searchIndex.includes(search);
      return matchesFilter && matchesSearch;
    });
  }

  function renderDocumentCard(doc) {
    const status = STATUS_CONFIG[doc.status] || STATUS_CONFIG.processing;
    const statusClass = `document-status document-status-${status.className}`;
    const chips = [];

    if (doc.meta?.charCount) chips.push(`${Number(doc.meta.charCount).toLocaleString()} 字`);
    if (doc.meta?.pageCount) chips.push(`${doc.meta.pageCount} 页`);
    if (doc.meta?.innerFile) chips.push(`内含 ${doc.meta.innerFile.split('/').pop()}`);
    if (doc.meta?.lastGeneratedAt) chips.push('已生成题库');

    const chipHtml = chips.length
      ? chips.map((value) => `<span class="document-chip">${escapeHtml(value)}</span>`).join('')
      : '';

    const metaParts = [
      doc.categoryLabel,
      formatFileSize(doc.size),
      formatDateTime(doc.uploadDate)
    ].filter(Boolean);

    const snippet = doc.textPreview
      ? `<div class="document-snippet">${escapeHtml(doc.textPreview)}</div>`
      : '';

    return `
      <div class="document-card${state.selectedId === doc.id ? ' selected' : ''}" data-doc-id="${doc.id}">
        <div class="document-icon">${doc.icon || DEFAULT_ICON}</div>
        <div class="document-info">
          <div class="document-name" title="${escapeHtml(doc.name)}">${escapeHtml(doc.name)}</div>
          <div class="document-meta">
            ${metaParts.map((part) => `<span>${escapeHtml(part)}</span>`).join('')}
          </div>
          <div class="document-footer">
            <span class="${statusClass}">${status.label}</span>
            ${chipHtml}
          </div>
          ${snippet}
        </div>
      </div>
    `;
  }

  function highlightSelectedCard() {
    if (!elements.grid) return;
    elements.grid.querySelectorAll('.document-card').forEach((card) => {
      if (card.dataset.docId === state.selectedId) {
        card.classList.add('selected');
      } else {
        card.classList.remove('selected');
      }
    });
  }

  function setCurrentDocument(docId) {
    if (!docId) return;
    const doc = state.documents.find((item) => item.id === docId);
    if (!doc) return;
    state.selectedId = doc.id;
    currentDocument = doc;
    renderPreview();
    highlightSelectedCard();
    updateActionButtons(doc);
  }

  function renderPreview() {
    if (!elements.preview || !elements.previewTitle || !elements.previewMeta) return;

    const doc = currentDocument;
    if (!doc) {
      resetPreview();
      return;
    }

    elements.previewTitle.textContent = doc.name || '预览';
    elements.previewMeta.textContent = `${doc.categoryLabel || ''} • ${formatFileSize(doc.size)} • 上传于 ${formatDateTime(doc.uploadDate)}`;

    let contentHtml = '';

    if (doc.status === 'processing') {
      contentHtml = `
        <div class="preview-placeholder">
          <div class="spinner"></div>
          <p>文档正在解析，请稍候...</p>
        </div>
      `;
    } else if (doc.status === 'error') {
      const message = doc.errorMessage ? escapeHtml(doc.errorMessage) : '文档解析失败';
      contentHtml = `
        <div class="preview-placeholder">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"></path>
            <polyline points="13 2 13 9 20 9"></polyline>
          </svg>
          <h4>解析失败</h4>
          <p class="ocr-error">${message}</p>
          ${doc.dataUrl ? '<button class="cta-btn" data-action="retry-document">重新解析</button>' : ''}
        </div>
      `;
    } else if (doc.textContent) {
      contentHtml = `
        <div class="preview-text-container">
          <pre class="preview-text">${escapeHtml(doc.textContent)}</pre>
        </div>
      `;
    } else {
      contentHtml = `
        <div class="preview-placeholder">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"></path>
            <polyline points="13 2 13 9 20 9"></polyline>
          </svg>
          <p>文档中没有可预览的文本内容</p>
        </div>
      `;
    }

    elements.preview.innerHTML = `${renderPreviewSummary(doc)}${contentHtml}`;
    if (elements.ocrContent) {
      elements.ocrContent.innerHTML = renderOcrContent(doc);
    }
  }

  function renderPreviewSummary(doc) {
    const items = [];

    if (doc.categoryLabel) items.push({ label: '类型', value: doc.categoryLabel });
    if (doc.meta?.charCount) items.push({ label: '字数', value: doc.meta.charCount.toLocaleString() });
    if (doc.meta?.lineCount) items.push({ label: '行数', value: doc.meta.lineCount });
    if (doc.meta?.pageCount) items.push({ label: '页数', value: doc.meta.pageCount });
    if (doc.meta?.wordCount) items.push({ label: '词数', value: doc.meta.wordCount });
    if (doc.meta?.readingMinutes) items.push({ label: '阅读', value: `${doc.meta.readingMinutes} 分钟` });
    if (doc.meta?.innerFile) items.push({ label: '来源文件', value: doc.meta.innerFile.split('/').pop() });

    if (!items.length) return '';

    const pills = items.map((item) => `
      <span class="preview-pill">
        <strong>${escapeHtml(item.label)}</strong>
        <span>${escapeHtml(String(item.value))}</span>
      </span>
    `).join('');

    return `<div class="preview-summary">${pills}</div>`;
  }

  function renderOcrContent(doc) {
    if (doc.status === 'processing') {
      return `
        <div class="ocr-loading">
          <div class="spinner"></div>
          <p>正在解析文档...</p>
        </div>
      `;
    }

    if (doc.status === 'error') {
      const message = doc.errorMessage ? escapeHtml(doc.errorMessage) : '未能提取到文本内容';
      return `
        <div class="ocr-error">
          ${message}
          ${doc.dataUrl ? '<br><button class="secondary-btn" data-action="retry-document">重新解析</button>' : ''}
        </div>
      `;
    }

    if (doc.textContent) {
      const summaryChips = [];
      if (doc.meta?.charCount) summaryChips.push(`<span>${doc.meta.charCount.toLocaleString()} 字符</span>`);
      if (doc.meta?.lineCount) summaryChips.push(`<span>${doc.meta.lineCount} 行</span>`);
      if (doc.meta?.wordCount) summaryChips.push(`<span>${doc.meta.wordCount} 词</span>`);
      if (doc.meta?.readingMinutes) summaryChips.push(`<span>约 ${doc.meta.readingMinutes} 分钟阅读</span>`);
      if (doc.meta?.innerFile) summaryChips.push(`<span>来源: ${escapeHtml(doc.meta.innerFile.split('/').pop())}</span>`);

      const summary = summaryChips.length ? `<div class="ocr-summary">${summaryChips.join('')}</div>` : '';
      const warnings = Array.isArray(doc.meta?.warnings) && doc.meta.warnings.length
        ? `<p class="ocr-warning">⚠️ ${escapeHtml(doc.meta.warnings.join('；'))}</p>`
        : '';

      return `
        ${summary}
        <div class="ocr-text">${convertTextToHtml(doc.textContent)}</div>
        ${warnings}
      `;
    }

    return '<p class="ocr-empty">文档中没有可用的文字内容。</p>';
  }

  function resetPreview() {
    if (!elements.preview || !elements.previewTitle || !elements.previewMeta) return;
    elements.previewTitle.textContent = '预览';
    elements.previewMeta.textContent = '选择一个文档查看详情';
    elements.preview.innerHTML = `
      <div class="preview-placeholder">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"></path>
          <polyline points="13 2 13 9 20 9"></polyline>
        </svg>
        <p>选择一个文档开始预览</p>
      </div>
    `;
    if (elements.ocrContent) {
      elements.ocrContent.innerHTML = '<p>上传文档后，系统会自动提取文字并显示在此处。</p>';
    }
    updateActionButtons(null);
  }

  function updateActionButtons(doc) {
    const hasDoc = Boolean(doc);
    if (elements.downloadBtn) {
      elements.downloadBtn.disabled = !hasDoc || !doc?.dataUrl;
    }
    if (elements.deleteBtn) {
      elements.deleteBtn.disabled = !hasDoc;
    }
    if (elements.copyBtn) {
      const canCopy = hasDoc && doc.status === 'ready' && doc.textContent;
      elements.copyBtn.disabled = !canCopy;
    }
    if (elements.generateBtn) {
      const canGenerate = hasDoc && doc.status === 'ready' && doc.textContent && doc.textContent.trim().length >= MIN_TEXT_LENGTH_FOR_GENERATION;
      elements.generateBtn.disabled = !canGenerate;
    }
  }

  function downloadCurrentDocument() {
    const doc = currentDocument;
    if (!doc || !doc.dataUrl) {
      alert('当前没有可下载的文档');
      return;
    }
    const link = document.createElement('a');
    link.href = doc.dataUrl;
    link.download = doc.name || 'document';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  async function deleteCurrentDocument() {
    const doc = currentDocument;
    if (!doc) return;
    if (!confirm(`确定要删除 "${doc.name}" 吗？`)) return;

    try {
      await DocumentStore.delete(doc.id);
      removeDocumentFromState(doc.id);
      if (state.documents.length > 0) {
        const nextDoc = state.documents[0];
        currentDocument = nextDoc;
        state.selectedId = nextDoc.id;
        renderPreview();
      } else {
        currentDocument = null;
        state.selectedId = null;
        resetPreview();
      }
      await renderDocuments();
    } catch (error) {
      console.error('Error deleting document:', error);
      alert('删除文档失败：' + (error.message || '未知错误'));
    }
  }

  async function clearAllDocuments() {
    if (!state.documents.length) {
      alert('当前没有文档可以清空');
      return;
    }
    if (!confirm('确定要清空所有文档吗？此操作不可恢复！')) return;

    try {
      await DocumentStore.clear();
      state.documents = [];
      state.selectedId = null;
      currentDocument = null;
      await renderDocuments();
      resetPreview();
      alert('所有文档已清空');
    } catch (error) {
      console.error('Error clearing documents:', error);
      alert('清空文档失败：' + (error.message || '未知错误'));
    }
  }

  async function copyCurrentText() {
    const doc = currentDocument;
    if (!doc || !doc.textContent) return;
    if (!navigator.clipboard) {
      alert('当前浏览器不支持复制到剪贴板');
      return;
    }
    try {
      await navigator.clipboard.writeText(doc.textContent);
      showTemporaryButtonState(elements.copyBtn, '✓ 已复制');
    } catch (error) {
      console.error('Failed to copy text:', error);
      alert('复制失败：' + (error.message || '未知错误'));
    }
  }

  function showTemporaryButtonState(button, text, duration = 2000) {
    if (!button) return;
    const originalText = button.textContent;
    button.textContent = text;
    setTimeout(() => {
      button.textContent = originalText;
    }, duration);
  }

  async function reprocessCurrentDocument() {
    const doc = currentDocument;
    if (!doc) return;
    if (!doc.dataUrl) {
      alert('缺少原始文件数据，无法重新解析');
      return;
    }

    const definition = getDefinitionFromDoc(doc);
    if (!definition) {
      alert('当前文档类型不受支持，无法重新解析');
      return;
    }

    try {
      toggleUploadAreaUploading(true);
      setUploadAreaMessage(`正在重新解析 ${doc.name}`);

      const response = await fetch(doc.dataUrl);
      const blob = await response.blob();
      const file = new File([blob], doc.name, { type: doc.type || blob.type });

      const updated = await processFile(file, definition, doc);
      setCurrentDocument(updated.id);
      setUploadAreaMessage('文档已重新解析', true);
    } catch (error) {
      console.error('Failed to reprocess document:', error);
      alert('重新解析失败：' + (error.message || '未知错误'));
      setUploadAreaMessage('重新解析失败', true);
    } finally {
      toggleUploadAreaUploading(false);
    }
  }

  async function extractTextByDefinition(file, definition) {
    switch (definition.category) {
      case 'markdown':
        return extractMarkdownText(file);
      case 'text':
        return extractPlainText(file);
      case 'pdf':
        return extractPdfText(file);
      case 'docx':
        return extractDocxText(file);
      case 'zip':
        return extractZipText(file);
      default:
        throw new Error('暂不支持的文件类型');
    }
  }

  async function extractPlainText(file) {
    const text = await file.text();
    return {
      text,
      meta: { source: 'plain-text' },
      source: 'plain-text'
    };
  }

  async function extractMarkdownText(file) {
    const raw = await file.text();
    const text = convertMarkdownToText(raw);
    return {
      text,
      meta: { source: 'markdown' },
      source: 'markdown'
    };
  }

  async function extractPdfText(file) {
    if (typeof pdfjsLib === 'undefined') {
      throw new Error('未加载 PDF 解析库（pdf.js）');
    }

    await ensurePdfWorker();
    const arrayBuffer = await file.arrayBuffer();

    try {
      const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
      const pdf = await loadingTask.promise;
      const pages = [];
      for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber++) {
        const page = await pdf.getPage(pageNumber);
        const content = await page.getTextContent();
        const strings = content.items.map((item) => item.str).filter(Boolean);
        const pageText = strings.join(' ').replace(/\s+/g, ' ').trim();
        if (pageText) {
          pages.push(pageText);
        }
      }
      return {
        text: pages.join('\n\n'),
        meta: { pageCount: pdf.numPages, source: 'pdf' },
        source: 'pdf'
      };
    } catch (error) {
      throw new Error('PDF 文本提取失败');
    }
  }

  async function ensurePdfWorker() {
    if (pdfWorkerReady) return;
    if (typeof pdfjsLib === 'undefined') return;
    if (pdfjsLib.GlobalWorkerOptions && !pdfjsLib.GlobalWorkerOptions.workerSrc) {
      pdfjsLib.GlobalWorkerOptions.workerSrc = PDF_WORKER_URL;
    }
    pdfWorkerReady = true;
  }

  async function extractDocxText(file) {
    if (!window.mammoth || typeof window.mammoth.extractRawText !== 'function') {
      throw new Error('未加载 Word 解析库（Mammoth）');
    }
    const arrayBuffer = await file.arrayBuffer();
    try {
      const result = await window.mammoth.extractRawText({ arrayBuffer });
      const warnings = (result.messages || [])
        .map((message) => message.message || message.value)
        .filter(Boolean);
      return {
        text: result.value || '',
        meta: { warnings, source: 'docx' },
        source: 'docx'
      };
    } catch (error) {
      throw new Error('Word 文档解析失败');
    }
  }

  async function extractZipText(file) {
    if (!window.JSZip) {
      throw new Error('未加载 ZIP 解压库');
    }
    const arrayBuffer = await file.arrayBuffer();
    try {
      const zip = await JSZip.loadAsync(arrayBuffer);
      const candidates = zip.file(/\.md$|\.markdown$|\.txt$/i);
      if (!candidates.length) {
        throw new Error('压缩包中未找到 Markdown 或文本文件');
      }
      const target = candidates[0];
      const content = await target.async('text');
      const isMarkdown = /\.md$|\.markdown$/i.test(target.name);
      const text = isMarkdown ? convertMarkdownToText(content) : content;
      return {
        text,
        meta: {
          innerFile: target.name,
          extractedFiles: candidates.length,
          source: isMarkdown ? 'zip-markdown' : 'zip-text'
        },
        source: isMarkdown ? 'zip-markdown' : 'zip-text'
      };
    } catch (error) {
      throw new Error(error.message || '压缩包解析失败');
    }
  }

  function convertMarkdownToText(markdown) {
    const normalized = (markdown || '').replace(/\r\n/g, '\n');
    if (typeof marked !== 'undefined' && typeof marked.parse === 'function') {
      const html = marked.parse(normalized);
      const temp = document.createElement('div');
      temp.innerHTML = html;
      return (temp.textContent || temp.innerText || normalized).replace(/\s+\n/g, '\n').trim();
    }
    return normalized
      .replace(/```[\s\S]*?```/g, '')
      .replace(/`([^`]+)`/g, '$1')
      .replace(/\[(.*?)\]\(.*?\)/g, '$1')
      .replace(/[\#>*_~\-]+/g, '')
      .replace(/\s{2,}/g, ' ')
      .trim();
  }

  function normalizeText(text) {
    return (text || '').replace(/\r\n/g, '\n').replace(/\u00a0/g, ' ').trim();
  }

  function countLines(text) {
    if (!text) return 0;
    return text.split(/\n/).length;
  }

  function countWords(text) {
    if (!text) return 0;
    const englishWords = text.match(/[A-Za-z0-9_]+/g) || [];
    const chineseChars = text.match(/[\u4e00-\u9fa5]/g) || [];
    return englishWords.length + chineseChars.length;
  }

  function calculateReadingMinutes(wordCount, charCount) {
    const base = wordCount || Math.round((charCount || 0) / 1.6);
    if (!base) return 0;
    return Math.max(1, Math.round(base / 250));
  }

  function createSnippet(text) {
    const trimmed = (text || '').replace(/\s+/g, ' ').trim();
    if (trimmed.length <= SNIPPET_LENGTH) {
      return trimmed;
    }
    return `${trimmed.slice(0, SNIPPET_LENGTH)}…`;
  }

  function formatFileSize(bytes) {
    if (!Number.isFinite(bytes)) return '0 B';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  }

  function formatDateTime(timestamp) {
    if (!timestamp) return '—';
    try {
      return new Date(timestamp).toLocaleString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return '—';
    }
  }

  function escapeHtml(value) {
    return String(value || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function convertTextToHtml(text) {
    return escapeHtml(text || '').replace(/\n/g, '<br>');
  }

  function getExtension(name) {
    if (!name) return '';
    const match = name.toLowerCase().match(/(\.[a-z0-9]+)$/i);
    return match ? match[1] : '';
  }

  function generateId() {
    return `${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
  }

  function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  function generateQuestionsFromDocument() {
    const doc = currentDocument;
    if (!doc) {
      alert('请先选择一个文档');
      return;
    }
    if (doc.status === 'processing') {
      alert('文档仍在解析中，请稍候再试');
      return;
    }
    if (doc.status === 'error') {
      alert('文档解析失败，请重新解析后再试');
      return;
    }
    const text = doc.textContent ? doc.textContent.trim() : '';
    if (!text) {
      alert('文档中未检测到可用的文本内容');
      return;
    }
    if (text.length < MIN_TEXT_LENGTH_FOR_GENERATION) {
      alert(`文本内容不足以生成题目。\n当前长度：${text.length} 个字符\n最少需要：${MIN_TEXT_LENGTH_FOR_GENERATION} 个字符以上`);
      return;
    }
    showGenerateDialog(doc, text);
  }

  function showGenerateDialog(doc, text) {
    if (!doc || !text) {
      alert('无法获取文档内容');
      return;
    }

    const existingModal = document.querySelector('.modal-overlay.generate-modal-overlay');
    if (existingModal) {
      existingModal.remove();
    }

    const modal = document.createElement('div');
    modal.className = 'modal-overlay generate-modal-overlay';
    modal.innerHTML = `
      <div class="modal-content generate-modal">
        <div class="modal-header">
          <h2>🎯 从文档生成题库</h2>
          <button class="modal-close" aria-label="关闭对话框">×</button>
        </div>
        <div class="modal-body">
          <div class="generate-form">
            <div class="form-group">
              <label>目标文档：</label>
              <div class="input-hint">
                <strong>${escapeHtml(doc.name)}</strong>
                <br>${escapeHtml(doc.categoryLabel)} · ${formatFileSize(doc.size)} · ${text.length.toLocaleString()} 字符
              </div>
            </div>
            <div class="form-group">
              <label for="questionCount">生成题目数量：</label>
              <div class="input-group">
                <input type="number" id="questionCount" min="5" max="50" value="10" />
                <span class="input-hint">5-50题</span>
              </div>
            </div>
            <div class="form-group">
              <label>题目类型：</label>
              <div class="checkbox-group">
                <label><input type="checkbox" value="single" checked /> 单选题</label>
                <label><input type="checkbox" value="multiple" checked /> 多选题</label>
                <label><input type="checkbox" value="truefalse" checked /> 判断题</label>
              </div>
            </div>
            <div class="form-group">
              <label for="questionModule">题目模块：</label>
              <select id="questionModule">
                <option value="custom">自定义题库</option>
                <option value="basics">机器人基础</option>
                <option value="sensors">传感器技术</option>
                <option value="control">控制系统</option>
                <option value="programming">编程基础</option>
                <option value="kinematics">运动学</option>
                <option value="vision">视觉系统</option>
                <option value="ai">人工智能</option>
                <option value="applications">应用实践</option>
              </select>
            </div>
            <div class="form-group">
              <label>
                <input type="checkbox" id="addToReview" checked />
                自动添加到复习计划（使用间隔重复算法）
              </label>
            </div>
            <div class="form-group">
              <label>
                <input type="checkbox" id="createMockExam" />
                生成后立即开始模拟考试
              </label>
            </div>
            <div class="generate-info">
              <p>📝 文档字符数：<strong>${text.length.toLocaleString()}</strong></p>
              <p>✨ 系统会自动分析文本内容并智能生成题目</p>
            </div>
          </div>
          <div id="generateProgress" class="generate-progress" style="display: none;">
            <div class="progress-bar">
              <div class="progress-fill"></div>
            </div>
            <p class="progress-text">正在生成题库...</p>
          </div>
        </div>
        <div class="modal-footer">
          <button class="secondary-btn" data-action="close-modal">取消</button>
          <button class="cta-btn" id="startGenerate">🚀 开始生成</button>
        </div>
      </div>
    `;

    document.body.appendChild(modal);

    const closeModal = () => modal.remove();
    modal.querySelector('.modal-close')?.addEventListener('click', closeModal);
    modal.querySelector('[data-action="close-modal"]')?.addEventListener('click', closeModal);
    modal.addEventListener('click', (event) => {
      if (event.target === modal) {
        closeModal();
      }
    });

    modal.querySelector('#questionCount')?.addEventListener('change', (event) => {
      let value = parseInt(event.target.value, 10);
      if (Number.isNaN(value)) value = 10;
      value = Math.max(5, Math.min(50, value));
      event.target.value = value;
    });

    modal.querySelector('#startGenerate')?.addEventListener('click', () => performQuestionGeneration(doc, text, modal));
  }

  async function performQuestionGeneration(doc, text, modal) {
    const countInput = modal.querySelector('#questionCount');
    const moduleSelect = modal.querySelector('#questionModule');
    const addToReview = modal.querySelector('#addToReview');
    const createMockExam = modal.querySelector('#createMockExam');
    const typeCheckboxes = modal.querySelectorAll('.checkbox-group input[type="checkbox"]:checked');
    const form = modal.querySelector('.generate-form');
    const progress = modal.querySelector('#generateProgress');
    const progressFill = modal.querySelector('.progress-fill');
    const progressText = modal.querySelector('.progress-text');
    const startButton = modal.querySelector('#startGenerate');

    if (!countInput || !moduleSelect || !form || !progress || !progressFill || !progressText) {
      alert('对话框结构异常，请重试');
      return;
    }

    const count = Math.max(5, Math.min(50, parseInt(countInput.value, 10) || 10));
    const selectedTypes = Array.from(typeCheckboxes).map((checkbox) => checkbox.value);

    if (!selectedTypes.length) {
      alert('请至少选择一种题目类型');
      return;
    }

    form.style.display = 'none';
    progress.style.display = 'block';
    if (startButton) startButton.disabled = true;

    try {
      progressFill.style.backgroundColor = '';
      progressText.textContent = '正在分析文档内容...';
      progressFill.style.width = '20%';
      await sleep(300);

      if (typeof QuestionGenerator === 'undefined' || typeof QuestionGenerator.generateQuestions !== 'function') {
        throw new Error('题目生成器未加载，请刷新页面后重试');
      }

      progressText.textContent = '正在提取知识点...';
      progressFill.style.width = '40%';
      await sleep(300);

      let questions;
      try {
        questions = QuestionGenerator.generateQuestions(text, {
          module: moduleSelect.value || 'custom',
          count,
          types: selectedTypes
        });
      } catch (error) {
        throw new Error(error.message || '题目生成失败');
      }

      if (!Array.isArray(questions) || !questions.length) {
        throw new Error('生成的题目为空，请尝试增加文档内容');
      }

      progressText.textContent = `已生成 ${questions.length} 道题目...`;
      progressFill.style.width = '60%';
      await sleep(300);

      progressText.textContent = '正在保存生成题目...';
      progressFill.style.width = '80%';

      if (typeof window.addGeneratedQuestions !== 'function') {
        throw new Error('题库保存函数未定义');
      }

      window.addGeneratedQuestions(questions, {
        addToReview: addToReview && addToReview.checked,
        createMockExam: createMockExam && createMockExam.checked
      });

      progressText.textContent = '✓ 题目已生成并保存！';
      progressFill.style.width = '100%';

      const updatedDoc = await saveAndSyncDocument({
        ...doc,
        meta: {
          ...(doc.meta || {}),
          lastGeneratedAt: Date.now(),
          lastGeneratedCount: questions.length
        },
        updatedAt: Date.now()
      });

      currentDocument = updatedDoc;
      state.selectedId = updatedDoc.id;
      await renderDocuments();
      renderPreview();

      await sleep(600);

      showGenerationResult(updatedDoc, questions, modal, {
        createMockExam: createMockExam && createMockExam.checked
      });
    } catch (error) {
      console.error('生成题目过程中出错:', error);
      progressText.textContent = `❌ 生成失败：${error.message || '未知错误'}`;
      progressFill.style.width = '100%';
      progressFill.style.backgroundColor = 'var(--error-color, #f44336)';

      setTimeout(() => {
        form.style.display = 'block';
        progress.style.display = 'none';
        progressFill.style.width = '0%';
        progressFill.style.backgroundColor = '';
        if (startButton) startButton.disabled = false;
      }, 3000);
    }
  }

  function showGenerationResult(doc, questions, modal, options = {}) {
    const modalBody = modal.querySelector('.modal-body');
    const modalFooter = modal.querySelector('.modal-footer');
    if (!modalBody || !Array.isArray(questions)) {
      alert('显示生成结果时出错');
      return;
    }

    const singleCount = questions.filter((q) => q.type === 'single').length;
    const multipleCount = questions.filter((q) => q.type === 'multiple').length;
    const trueFalseCount = questions.filter((q) => q.type === 'truefalse').length;

    modalBody.innerHTML = `
      <div class="generate-result">
        <div class="result-icon">🎉</div>
        <h3>题库生成成功！</h3>
        <p>文档：<strong>${escapeHtml(doc.name)}</strong></p>
        <div class="result-stats">
          <div class="stat-item">
            <div class="stat-number">${questions.length}</div>
            <div class="stat-label">题目总数</div>
          </div>
          <div class="stat-item">
            <div class="stat-number">${singleCount}</div>
            <div class="stat-label">单选题</div>
          </div>
          <div class="stat-item">
            <div class="stat-number">${multipleCount}</div>
            <div class="stat-label">多选题</div>
          </div>
          <div class="stat-item">
            <div class="stat-number">${trueFalseCount}</div>
            <div class="stat-label">判断题</div>
          </div>
        </div>
        <div class="result-note">
          <p>✅ 题目已保存到题库，可在「练习」中查看</p>
        </div>
        <div class="result-actions">
          ${options.createMockExam ? '<button class="cta-btn" onclick="window.startMockExam && window.startMockExam()">🚀 开始模拟考试</button>' : ''}
          <button class="cta-btn" onclick="window.switchView && window.switchView('practice')">📝 进入练习</button>
          <button class="secondary-btn" data-action="close-modal">关闭</button>
        </div>
      </div>
    `;

    if (modalFooter) {
      modalFooter.style.display = 'none';
    }

    modalBody.querySelector('[data-action="close-modal"]')?.addEventListener('click', () => modal.remove());
  }

  return {
    init,
    renderDocuments,
    downloadCurrentDocument,
    getCurrentDocument: () =>
      currentDocument ? { ...currentDocument, meta: currentDocument.meta ? { ...currentDocument.meta } : null } : null,
    generateQuestionsFromDocument
  };
})();
