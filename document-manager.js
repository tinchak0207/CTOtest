const DocumentManager = (function() {
  const DB_NAME = 'RoboticsLearningDocuments';
  const DB_VERSION = 1;
  const STORE_NAME = 'documents';
  const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
  const SUPPORTED_FILE_TYPES = [
    'text/markdown', // .md
    'text/plain', // .txt
  ];
  
  let db = null;
  let currentDocument = null;
  let initialized = false;
  let listenersBound = false;

  function escapeHtml(str = '') {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function initIndexedDB() {
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

  async function extractTextFromFile(file) {
    try {
      const text = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = () => reject(new Error('文件读取失败'));
        reader.readAsText(file);
      });

      if (file.type === 'text/markdown') {
        if (typeof marked === 'undefined') {
          console.warn('marked库未加载，返回原始文本');
          return text;
        }
        const html = marked.parse(text);
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = html;
        return tempDiv.textContent || tempDiv.innerText || '';
      }

      if (file.type === 'text/plain') {
        return text;
      }

      return null;
    } catch (error) {
      console.warn(`文本提取失败 for ${file.name}:`, error);
      return null;
    }
  }

  async function saveDocument(file) {
    if (!db) await initIndexedDB();

    try {
      const dataUrl = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });

      const doc = {
        id: Date.now() + '_' + Math.random().toString(36).substr(2, 9),
        name: file.name,
        type: file.type,
        size: file.size,
        data: dataUrl,
        uploadDate: Date.now(),
        ocrText: null
      };

      try {
        doc.ocrText = await extractTextFromFile(file);
      } catch (error) {
        console.warn(`Text extraction failed for ${file.name}:`, error);
      }

      const transaction = db.transaction([STORE_NAME], 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.add(doc);

      return new Promise((resolve, reject) => {
        request.onsuccess = () => resolve(doc);
        request.onerror = () => reject(request.error);
      });
    } catch (error) {
      console.error('Error saving document:', error);
      throw error;
    }
  }

  async function getAllDocuments() {
    if (!db) await initIndexedDB();
    
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORE_NAME], 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.getAll();
      
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async function getDocument(id) {
    if (!db) await initIndexedDB();
    
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORE_NAME], 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.get(id);
      
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async function deleteDocument(id) {
    if (!db) await initIndexedDB();
    
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORE_NAME], 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.delete(id);
      
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async function clearAllDocuments() {
    if (!db) await initIndexedDB();
    
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORE_NAME], 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.clear();
      
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  function formatFileSize(bytes) {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
  }

  function formatDate(timestamp) {
    const date = new Date(timestamp);
    return date.toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  function getFileIcon(type) {
    if (type === 'text/markdown') return '✍️';
    if (type === 'text/plain') return '📄';
    return '📎';
  }

  function getFileTypeLabel(type) {
    if (type === 'text/markdown') return 'md';
    if (type === 'text/plain') return 'txt';
    return 'other';
  }

  async function renderDocuments(searchQuery = '', typeFilter = '') {
    const grid = document.getElementById('documentsGrid');
    const countEl = document.getElementById('documentsCount');
    
    if (!grid) return;

    try {
      let documents = await getAllDocuments();
      
      // Apply filters
      if (searchQuery) {
        documents = documents.filter(doc => 
          doc.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }
      
      if (typeFilter) {
        documents = documents.filter(doc => 
          getFileTypeLabel(doc.type) === typeFilter
        );
      }

      // Sort by upload date (newest first)
      documents.sort((a, b) => b.uploadDate - a.uploadDate);

      if (countEl) countEl.textContent = documents.length;

      if (documents.length === 0) {
        grid.innerHTML = `
          <div class="documents-empty">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/>
              <polyline points="13 2 13 9 20 9"/>
            </svg>
            <p>${searchQuery || typeFilter ? '未找到匹配的文档' : '暂无文档，点击上方按钮上传'}</p>
          </div>
        `;
        return;
      }

      grid.innerHTML = documents.map(doc => `
        <div class="document-card" data-doc-id="${doc.id}">
          <div class="document-icon">${getFileIcon(doc.type)}</div>
          <div class="document-info">
            <div class="document-name" title="${escapeHtml(doc.name)}">${escapeHtml(doc.name)}</div>
            <div class="document-meta">
              <span>${formatFileSize(doc.size)}</span>
              <span>${formatDate(doc.uploadDate)}</span>
            </div>
            ${doc.ocrText ? '<span class="document-badge">✓ OCR</span>' : ''}
          </div>
        </div>
      `).join('');

      // Add click handlers
      grid.querySelectorAll('.document-card').forEach(card => {
        card.addEventListener('click', () => {
          const docId = card.dataset.docId;
          previewDocument(docId);
        });
      });
    } catch (error) {
      console.error('Error rendering documents:', error);
      grid.innerHTML = `
        <div class="documents-error">
          <p>❌ 加载文档失败: ${error.message}</p>
        </div>
      `;
    }
  }

  async function previewDocument(id) {
    try {
      const doc = await getDocument(id);
      if (!doc) return;

      currentDocument = doc;

      // Update preview header
      const titleEl = document.getElementById('previewTitle');
      const metaEl = document.getElementById('previewMeta');
      if (titleEl) titleEl.textContent = doc.name;
      if (metaEl) metaEl.textContent = `${formatFileSize(doc.size)} • ${formatDate(doc.uploadDate)}`;

      // Enable action buttons
      const downloadBtn = document.getElementById('downloadDocument');
      const deleteBtn = document.getElementById('deleteDocument');
      const copyBtn = document.getElementById('copyOcrText');
      const generateBtn = document.getElementById('generateQuestionsBtn');
      
      if (downloadBtn) downloadBtn.disabled = false;
      if (deleteBtn) deleteBtn.disabled = false;
      if (copyBtn) copyBtn.disabled = !doc.ocrText;
      if (generateBtn) generateBtn.disabled = !doc.ocrText;

      // Render preview
      const previewEl = document.getElementById('documentPreview');
      if (!previewEl) return;

      if (doc.ocrText) {
        const safeOcr = escapeHtml(doc.ocrText);
        previewEl.innerHTML = `
          <div class="preview-text-container">
            <pre class="preview-text">${safeOcr}</pre>
          </div>
        `;
      } else {
        previewEl.innerHTML = `
          <div class="preview-placeholder">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/>
              <polyline points="13 2 13 9 20 9"/>
            </svg>
            <p>无法预览此文件内容</p>
            <button class="cta-btn" onclick="DocumentManager.downloadCurrentDocument()">下载文件</button>
          </div>
        `;
      }

      // Update OCR content
      const ocrContentEl = document.getElementById('ocrContent');
      if (ocrContentEl) {
        if (doc.ocrText) {
          const safeOcr = escapeHtml(doc.ocrText);
          ocrContentEl.innerHTML = `
            <div class="ocr-text">${safeOcr.replace(/\n/g, '<br>')}</div>
          `;
        } else {
          ocrContentEl.innerHTML = `
            <p class="ocr-empty">无法提取文件中的文本内容，或该文件类型不支持文本提取。</p>
          `;
        }
      }

      // Highlight selected card
      document.querySelectorAll('.document-card').forEach(card => {
        card.classList.remove('selected');
        if (card.dataset.docId === id) {
          card.classList.add('selected');
        }
      });

    } catch (error) {
      console.error('Error previewing document:', error);
      alert('预览文档失败: ' + error.message);
    }
  }

  function downloadCurrentDocument() {
    if (!currentDocument) return;
    
    const link = document.createElement('a');
    link.href = currentDocument.data;
    link.download = currentDocument.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  async function deleteCurrentDocument() {
    if (!currentDocument) return;
    
    if (!confirm(`确定要删除 "${currentDocument.name}" 吗？`)) return;

    try {
      await deleteDocument(currentDocument.id);
      currentDocument = null;
      
      // Reset preview
      const previewEl = document.getElementById('documentPreview');
      if (previewEl) {
        previewEl.innerHTML = `
          <div class="preview-placeholder">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/>
              <polyline points="13 2 13 9 20 9"/>
            </svg>
            <p>选择一个文档开始预览</p>
          </div>
        `;
      }
      
      const ocrContentEl = document.getElementById('ocrContent');
      if (ocrContentEl) {
        ocrContentEl.innerHTML = '<p>当上传图片时，系统会自动识别文字并显示在此处。</p>';
      }

      // Disable buttons
      const downloadBtn = document.getElementById('downloadDocument');
      const deleteBtn = document.getElementById('deleteDocument');
      const copyBtn = document.getElementById('copyOcrText');
      const generateBtn = document.getElementById('generateQuestionsBtn');
      if (downloadBtn) downloadBtn.disabled = true;
      if (deleteBtn) deleteBtn.disabled = true;
      if (copyBtn) copyBtn.disabled = true;
      if (generateBtn) generateBtn.disabled = true;

      await renderDocuments();
    } catch (error) {
      console.error('Error deleting document:', error);
      alert('删除文档失败: ' + error.message);
    }
  }

  function copyOCRText() {
    if (!currentDocument || !currentDocument.ocrText) return;
    
    navigator.clipboard.writeText(currentDocument.ocrText).then(() => {
      const copyBtn = document.getElementById('copyOcrText');
      if (copyBtn) {
        const originalText = copyBtn.textContent;
        copyBtn.textContent = '✓ 已复制';
        setTimeout(() => {
          copyBtn.textContent = originalText;
        }, 2000);
      }
    }).catch(err => {
      console.error('Failed to copy:', err);
      alert('复制失败');
    });
  }

  async function handleFileUpload(files) {
    const uploadArea = document.getElementById('uploadArea');
    
    if (!files || files.length === 0) {
      return;
    }

    const validFiles = [];
    const errors = [];

    // 第一步：验证所有文件
    for (const file of files) {
      // Validate file size
      if (file.size > MAX_FILE_SIZE) {
        errors.push(`文件 "${file.name}" 超过10MB大小限制`);
        continue;
      }

      // Validate file type
      const fileType = file.type;
      const fileName = file.name.toLowerCase();
      
      let isSupported = SUPPORTED_FILE_TYPES.includes(fileType);

      // Fallback for systems that might not assign a MIME type to .md files
      if (!isSupported && fileName.endsWith('.md') && file.type === '') {
        isSupported = true;
        Object.defineProperty(file, 'type', { value: 'text/markdown' });
      }
      
      // Fallback for .txt files
      if (!isSupported && fileName.endsWith('.txt') && file.type === '') {
        isSupported = true;
        Object.defineProperty(file, 'type', { value: 'text/plain' });
      }

      if (!isSupported) {
        errors.push(`文件 "${file.name}" 类型不支持（仅支持 .md 和 .txt）`);
        continue;
      }

      validFiles.push(file);
    }

    // 显示验证错误
    if (errors.length > 0 && validFiles.length === 0) {
      alert(`文件验证失败：\n${errors.join('\n')}`);
      return;
    }

    if (errors.length > 0) {
      console.warn('文件验证警告：', errors);
    }

    if (validFiles.length === 0) {
      return;
    }

    // 第二步：上传文件
    const uploadProgress = [];
    const uploadedFiles = [];

    for (let i = 0; i < validFiles.length; i++) {
      const file = validFiles[i];
      const progress = `${i + 1}/${validFiles.length}`;

      try {
        // Show loading state
        if (uploadArea) {
          uploadArea.classList.add('uploading');
          const uploadText = uploadArea.querySelector('.upload-text');
          if (uploadText) {
            uploadText.textContent = `上传中... [${progress}] ${file.name}`;
          }
        }

        const doc = await saveDocument(file);
        uploadedFiles.push(doc);
        uploadProgress.push({ name: file.name, status: 'success' });

      } catch (error) {
        console.error('Upload error:', error);
        uploadProgress.push({ name: file.name, status: 'error', message: error.message });
      }
    }

    // Show result
    if (uploadArea) {
      const uploadText = uploadArea.querySelector('.upload-text');
      if (uploadText) {
        const successCount = uploadProgress.filter(p => p.status === 'success').length;
        const failCount = uploadProgress.filter(p => p.status === 'error').length;
        
        if (failCount > 0) {
          uploadText.textContent = `✓ 成功上传 ${successCount} 个，失败 ${failCount} 个`;
        } else {
          uploadText.textContent = `✓ 已上传 ${successCount} 个文件`;
        }
        
        setTimeout(() => {
          uploadText.textContent = '拖拽文件到此处或点击上传';
        }, 3000);
      }
      uploadArea.classList.remove('uploading');
    }

    // Show detailed errors if any
    const failedUploads = uploadProgress.filter(p => p.status === 'error');
    if (failedUploads.length > 0) {
      const failedList = failedUploads.map(p => `• ${p.name}: ${p.message}`).join('\n');
      alert(`以下文件上传失败：\n${failedList}`);
    }

    // Refresh document list
    await renderDocuments();

    return uploadedFiles;
  }

  function setupEventListeners() {
    if (listenersBound) return;
    listenersBound = true;

    const selectFilesBtn = document.getElementById('selectFilesBtn');
    const documentInput = document.getElementById('documentInput');
    const uploadArea = document.getElementById('uploadArea');
    
    // 处理文件选择
    const triggerFileSelect = () => {
      if (documentInput) {
        documentInput.click();
      }
    };

    // 设置选择文件按钮
    if (selectFilesBtn) {
      selectFilesBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        triggerFileSelect();
      });
    }

    // 设置上传区域本身可点击
    if (uploadArea) {
      uploadArea.addEventListener('click', (e) => {
        // 只在点击上传区域但不是点击按钮时触发
        if (e.target.id !== 'selectFilesBtn' && !e.target.closest('#selectFilesBtn')) {
          triggerFileSelect();
        }
      });
    }

    // 设置文件输入变化事件
    if (documentInput) {
      documentInput.addEventListener('change', (e) => {
        if (e.target.files && e.target.files.length > 0) {
          handleFileUpload(Array.from(e.target.files));
          e.target.value = ''; // Reset input
        }
      });
    }

    // 设置拖拽功能
    if (uploadArea) {
      // 阻止浏览器默认行为
      ['dragenter', 'dragover', 'dragleave', 'drop'].forEach((eventName) => {
        uploadArea.addEventListener(eventName, (e) => {
          e.preventDefault();
          e.stopPropagation();
        });
      });

      // 处理dragover - 显示视觉反馈
      uploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadArea.classList.add('drag-over');
      });

      // 处理dragleave - 移除视觉反馈
      uploadArea.addEventListener('dragleave', (e) => {
        e.preventDefault();
        // 确保只在离开uploadArea时移除，而不是离开子元素时
        if (e.target === uploadArea) {
          uploadArea.classList.remove('drag-over');
        }
      });

      // 处理drop - 上传文件
      uploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadArea.classList.remove('drag-over');
        
        if (e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files.length > 0) {
          handleFileUpload(Array.from(e.dataTransfer.files));
        }
      });

      // 处理dragend（以防万一）
      uploadArea.addEventListener('dragend', (e) => {
        uploadArea.classList.remove('drag-over');
      });
    }

    // Download button
    const downloadBtn = document.getElementById('downloadDocument');
    if (downloadBtn) {
      downloadBtn.addEventListener('click', downloadCurrentDocument);
    }

    // Delete button
    const deleteBtn = document.getElementById('deleteDocument');
    if (deleteBtn) {
      deleteBtn.addEventListener('click', deleteCurrentDocument);
    }

    // Copy OCR text button
    const copyBtn = document.getElementById('copyOcrText');
    if (copyBtn) {
      copyBtn.addEventListener('click', copyOCRText);
    }

    // Generate questions button
    const generateBtn = document.getElementById('generateQuestionsBtn');
    if (generateBtn) {
      generateBtn.addEventListener('click', generateQuestionsFromDocument);
    }

    // Clear all documents button
    const clearAllBtn = document.getElementById('clearAllDocuments');
    if (clearAllBtn) {
      clearAllBtn.addEventListener('click', async () => {
        if (!confirm('确定要清空所有文档吗？此操作不可恢复！')) return;
        
        try {
          await clearAllDocuments();
          currentDocument = null;
          
          // Reset preview
          const previewEl = document.getElementById('documentPreview');
          if (previewEl) {
            previewEl.innerHTML = `
              <div class="preview-placeholder">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/>
                  <polyline points="13 2 13 9 20 9"/>
                </svg>
                <p>选择一个文档开始预览</p>
              </div>
            `;
          }

          await renderDocuments();
          alert('所有文档已清空');
        } catch (error) {
          console.error('Error clearing documents:', error);
          alert('清空文档失败: ' + error.message);
        }
      });
    }

    // Search
    const searchInput = document.getElementById('documentSearch');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        const typeFilter = document.getElementById('documentTypeFilter')?.value || '';
        renderDocuments(e.target.value, typeFilter);
      });
    }

    // Type filter
    const typeFilter = document.getElementById('documentTypeFilter');
    if (typeFilter) {
      typeFilter.addEventListener('change', (e) => {
        const searchQuery = document.getElementById('documentSearch')?.value || '';
        renderDocuments(searchQuery, e.target.value);
      });
    }
  }

  async function init() {
    try {
      if (!initialized) {
        await initIndexedDB();
        initOCR();
        setupEventListeners();
        initialized = true;
      }
      await renderDocuments();
    } catch (error) {
      console.error('Error initializing DocumentManager:', error);
    }
  }

  /**
   * 生成题库（一键流程）
   */
  async function generateQuestionsFromDocument() {
    if (!currentDocument) {
      alert('请先选择一个文档');
      return;
    }

    let text = '';
    
    // 获取文本内容
    if (currentDocument.ocrText) {
      text = currentDocument.ocrText;
    } else if (currentDocument.type && currentDocument.type.startsWith('image/')) {
      alert('该图片尚未进行OCR识别，请等待处理完成后再生成题库');
      return;
    } else {
      const fileType = currentDocument.type || '未知';
      alert(`该文件类型不支持生成题库。\n文件类型: ${fileType}\n\n请上传 .md 或 .txt 文件。`);
      return;
    }

    // 检查文本长度
    const trimmedText = text ? text.trim() : '';
    if (trimmedText.length === 0) {
      alert('文档中未检测到文本内容。\n\n请确保文件包含有效的文本信息。');
      return;
    }

    if (trimmedText.length < 50) {
      alert(`文本内容不足以生成题目。\n当前文本长度: ${trimmedText.length} 字符\n最少需要: 50 字符`);
      return;
    }

    // 显示生成对话框
    showGenerateDialog(trimmedText);
  }

  /**
   * 显示生成题库对话框
   */
  function showGenerateDialog(text) {
    if (!text || typeof text !== 'string') {
      alert('无效的文本内容');
      return;
    }

    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.innerHTML = `
      <div class="modal-content generate-modal">
        <div class="modal-header">
          <h2>🎯 一键生成题库</h2>
          <button class="modal-close" onclick="this.closest('.modal-overlay').remove()">×</button>
        </div>
        <div class="modal-body">
          <div class="generate-form">
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
              <p>📝 文本长度：<strong>${text.length}</strong> 字符</p>
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
          <button class="secondary-btn" onclick="this.closest('.modal-overlay').remove()">取消</button>
          <button class="cta-btn" id="startGenerate">🚀 开始生成</button>
        </div>
      </div>
    `;

    document.body.appendChild(modal);

    // 绑定开始生成按钮
    const startBtn = modal.querySelector('#startGenerate');
    if (startBtn) {
      startBtn.addEventListener('click', () => {
        performQuestionGeneration(text, modal);
      });
    }

    // 验证 count input
    const countInput = modal.querySelector('#questionCount');
    if (countInput) {
      countInput.addEventListener('change', (e) => {
        let val = parseInt(e.target.value) || 10;
        val = Math.max(5, Math.min(50, val));
        e.target.value = val;
      });
    }
  }

  /**
   * 执行题目生成
   */
  async function performQuestionGeneration(text, modal) {
    const countInput = modal.querySelector('#questionCount');
    const moduleSelect = modal.querySelector('#questionModule');
    const addToReview = modal.querySelector('#addToReview');
    const createMockExam = modal.querySelector('#createMockExam');
    const typeCheckboxes = modal.querySelectorAll('.checkbox-group input[type="checkbox"]:checked');

    // 验证输入
    if (!countInput || !moduleSelect) {
      console.error('对话框元素缺失');
      alert('对话框错误，请重试');
      return;
    }

    const count = Math.max(5, Math.min(50, parseInt(countInput.value) || 10));
    const module = moduleSelect.value || 'custom';
    const types = Array.from(typeCheckboxes).map(cb => cb.value);

    if (types.length === 0) {
      alert('请至少选择一种题目类型');
      return;
    }

    if (!text || text.trim().length === 0) {
      alert('文本内容为空，无法生成题目');
      return;
    }

    // 显示进度
    const form = modal.querySelector('.generate-form');
    const progress = modal.querySelector('#generateProgress');
    
    if (!form || !progress) {
      alert('对话框结构错误，请重试');
      return;
    }

    const progressFill = progress.querySelector('.progress-fill');
    const progressText = progress.querySelector('.progress-text');
    const startBtn = modal.querySelector('#startGenerate');

    if (!progressFill || !progressText) {
      alert('进度显示组件缺失');
      return;
    }

    form.style.display = 'none';
    progress.style.display = 'block';
    if (startBtn) startBtn.disabled = true;

    try {
      // Step 1: 分析文档内容
      progressText.textContent = '正在分析文档内容...';
      progressFill.style.width = '20%';
      progressFill.style.backgroundColor = '';

      await sleep(300);

      // Step 2: 验证生成器
      if (typeof QuestionGenerator === 'undefined') {
        throw new Error('题目生成器未加载。请确保页面完全加载后再试。');
      }

      if (typeof QuestionGenerator.generateQuestions !== 'function') {
        throw new Error('题目生成器函数不可用');
      }

      progressText.textContent = '正在提取关键知识点...';
      progressFill.style.width = '40%';
      await sleep(300);

      // Step 3: 生成题目
      let questions;
      try {
        questions = QuestionGenerator.generateQuestions(text, {
          module,
          count,
          types
        });
      } catch (genError) {
        throw new Error(`题目生成失败: ${genError.message}`);
      }

      if (!Array.isArray(questions) || questions.length === 0) {
        throw new Error('生成的题目为空，请检查文本内容是否足够丰富');
      }

      progressText.textContent = `已生成 ${questions.length} 道题目...`;
      progressFill.style.width = '60%';
      await sleep(300);

      // Step 4: 保存题目
      progressText.textContent = '正在保存到题库...';
      progressFill.style.width = '80%';

      try {
        if (typeof window.addGeneratedQuestions === 'function') {
          window.addGeneratedQuestions(questions, {
            addToReview: addToReview && addToReview.checked,
            createMockExam: createMockExam && createMockExam.checked
          });
        } else {
          console.warn('addGeneratedQuestions 函数未定义，题目可能未正确保存');
          throw new Error('保存函数不可用');
        }
      } catch (saveError) {
        throw new Error(`保存题目失败: ${saveError.message}`);
      }

      progressText.textContent = '✓ 题库生成完成！';
      progressFill.style.width = '100%';

      await sleep(800);

      // 显示结果
      showGenerationResult(questions, modal, createMockExam && createMockExam.checked);

    } catch (error) {
      console.error('生成题目过程中出错:', error);
      
      const errorMsg = error.message || '未知错误';
      progressText.textContent = `❌ 生成失败: ${errorMsg}`;
      progressFill.style.width = '100%';
      progressFill.style.backgroundColor = 'var(--error-color, #f44336)';

      // 3秒后允许重试
      setTimeout(() => {
        try {
          form.style.display = 'block';
          progress.style.display = 'none';
          if (startBtn) startBtn.disabled = false;
          progressFill.style.width = '0%';
          progressFill.style.backgroundColor = '';
        } catch (e) {
          console.error('重置对话框失败:', e);
        }
      }, 3000);
    }
  }

  /**
   * 显示生成结果
   */
  function showGenerationResult(questions, modal, createMockExam) {
    if (!Array.isArray(questions)) {
      console.error('Invalid questions array');
      alert('生成结果无效，请重试');
      return;
    }

    const singleCount = questions.filter(q => q.type === 'single').length;
    const multipleCount = questions.filter(q => q.type === 'multiple').length;
    const trueFalseCount = questions.filter(q => q.type === 'truefalse').length;

    const resultHtml = `
      <div class="generate-result">
        <div class="result-icon">🎉</div>
        <h3>题库生成成功！</h3>
        <div class="result-stats">
          <div class="stat-item">
            <div class="stat-number">${questions.length}</div>
            <div class="stat-label">题目已生成</div>
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
          <p>✅ 题目已保存到题库，可在"练习"中查看</p>
        </div>
        <div class="result-actions">
          ${createMockExam ? '<button class="cta-btn" onclick="window.startMockExam && window.startMockExam()">🚀 开始模拟考试</button>' : ''}
          <button class="cta-btn" onclick="window.switchView && window.switchView(\'practice\')">📝 进入练习</button>
          <button class="secondary-btn" onclick="this.closest(\'.modal-overlay\').remove()">关闭</button>
        </div>
      </div>
    `;

    try {
      const modalBody = modal.querySelector('.modal-body');
      if (modalBody) {
        modalBody.innerHTML = resultHtml;
      }

      const modalFooter = modal.querySelector('.modal-footer');
      if (modalFooter) {
        modalFooter.style.display = 'none';
      }
    } catch (error) {
      console.error('Error displaying result:', error);
      alert('显示生成结果时出错: ' + error.message);
    }
  }

  /**
   * 辅助函数：延迟
   */
  function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Public API
  return {
    init,
    renderDocuments,
    downloadCurrentDocument,
    getCurrentDocument: () => currentDocument,
    generateQuestionsFromDocument
  };
})();
