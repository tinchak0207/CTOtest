const DocumentManager = (function() {
  const DB_NAME = 'RoboticsLearningDocuments';
  const DB_VERSION = 1;
  const STORE_NAME = 'documents';
  const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
  
  let db = null;
  let currentDocument = null;
  let ocrWorker = null;
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

  function initOCR() {
    if (typeof Tesseract !== 'undefined') {
      ocrWorker = Tesseract.createWorker({
        langPath: 'https://cdn.jsdelivr.net/npm/tesseract.js@5/tessdata',
        logger: (m) => {
          if (m.status === 'recognizing text') {
            updateOCRProgress(Math.round(m.progress * 100));
          }
        }
      });
    }
  }

  function updateOCRProgress(percent) {
    const ocrContent = document.getElementById('ocrContent');
    if (ocrContent && percent < 100) {
      ocrContent.innerHTML = `
        <div class="ocr-loading">
          <div class="spinner"></div>
          <p>正在识别文字... ${percent}%</p>
        </div>
      `;
    }
  }

  async function performOCR(file) {
    if (!ocrWorker) {
      initOCR();
      if (!ocrWorker) {
        throw new Error('OCR功能不可用');
      }
    }

    try {
      const ocrContent = document.getElementById('ocrContent');
      ocrContent.innerHTML = `
        <div class="ocr-loading">
          <div class="spinner"></div>
          <p>正在初始化OCR引擎...</p>
        </div>
      `;

      await ocrWorker.load();
      await ocrWorker.loadLanguage('chi_sim+eng');
      await ocrWorker.initialize('chi_sim+eng');

      const { data: { text } } = await ocrWorker.recognize(file);
      return text;
    } catch (error) {
      console.error('OCR error:', error);
      throw new Error('OCR识别失败: ' + error.message);
    }
  }

  async function saveDocument(file) {
    if (!db) await initIndexedDB();
    
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = async (e) => {
        const doc = {
          id: Date.now() + '_' + Math.random().toString(36).substr(2, 9),
          name: file.name,
          type: file.type,
          size: file.size,
          data: e.target.result,
          uploadDate: Date.now(),
          ocrText: null
        };

        // 如果是图片，执行OCR
        if (file.type.startsWith('image/')) {
          try {
            const ocrText = await performOCR(file);
            doc.ocrText = ocrText;
          } catch (error) {
            console.warn('OCR failed:', error);
          }
        }

        const transaction = db.transaction([STORE_NAME], 'readwrite');
        const store = transaction.objectStore(STORE_NAME);
        const request = store.add(doc);
        
        request.onsuccess = () => resolve(doc);
        request.onerror = () => reject(request.error);
      };
      
      reader.onerror = () => reject(reader.error);
      reader.readAsDataURL(file);
    });
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
    if (type.startsWith('image/')) {
      return '🖼️';
    } else if (type === 'application/pdf') {
      return '📄';
    }
    return '📎';
  }

  function getFileTypeLabel(type) {
    if (type.startsWith('image/')) return 'image';
    if (type === 'application/pdf') return 'pdf';
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

      const safeName = escapeHtml(doc.name);
      const dataUrl = doc.data;

      if (doc.type.startsWith('image/')) {
        previewEl.innerHTML = `
          <div class="preview-image-container">
            <img src="${dataUrl}" alt="${safeName}" class="preview-image">
          </div>
        `;
      } else if (doc.type === 'application/pdf') {
        previewEl.innerHTML = `
          <div class="preview-pdf-container">
            <iframe src="${dataUrl}" class="preview-pdf" title="PDF预览"></iframe>
            <p class="preview-hint">
              <a href="${dataUrl}" download="${safeName}" class="preview-download-link">
                下载PDF查看完整内容
              </a>
            </p>
          </div>
        `;
      } else {
        previewEl.innerHTML = `
          <div class="preview-placeholder">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/>
              <polyline points="13 2 13 9 20 9"/>
            </svg>
            <p>无法预览此文件类型</p>
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
        } else if (doc.type.startsWith('image/')) {
          ocrContentEl.innerHTML = `
            <p class="ocr-empty">该图片尚未进行OCR识别</p>
          `;
        } else {
          ocrContentEl.innerHTML = `
            <p class="ocr-empty">该文件类型不支持OCR识别</p>
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
    
    for (const file of files) {
      // Validate file size
      if (file.size > MAX_FILE_SIZE) {
        alert(`文件 "${file.name}" 超过10MB大小限制`);
        continue;
      }

      // Validate file type
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];
      if (!validTypes.includes(file.type)) {
        alert(`文件 "${file.name}" 类型不支持`);
        continue;
      }

      try {
        // Show loading state
        if (uploadArea) {
          uploadArea.classList.add('uploading');
          const uploadText = uploadArea.querySelector('.upload-text');
          if (uploadText) {
            uploadText.textContent = `正在上传 ${file.name}...`;
          }
        }

        await saveDocument(file);

        // Show success
        if (uploadArea) {
          const uploadText = uploadArea.querySelector('.upload-text');
          if (uploadText) {
            uploadText.textContent = '✓ 上传成功！';
            setTimeout(() => {
              uploadText.textContent = '拖拽文件到此处或点击上传';
            }, 2000);
          }
        }
      } catch (error) {
        console.error('Upload error:', error);
        alert(`上传 "${file.name}" 失败: ${error.message}`);
      } finally {
        if (uploadArea) {
          uploadArea.classList.remove('uploading');
        }
      }
    }

    // Refresh document list
    await renderDocuments();
  }

  function setupEventListeners() {
    if (listenersBound) return;
    listenersBound = true;

    // Select files button
    const selectFilesBtn = document.getElementById('selectFilesBtn');
    const documentInput = document.getElementById('documentInput');
    
    if (selectFilesBtn && documentInput) {
      selectFilesBtn.addEventListener('click', () => {
        documentInput.click();
      });
    }

    if (documentInput) {
      documentInput.addEventListener('change', (e) => {
        if (e.target.files.length > 0) {
          handleFileUpload(Array.from(e.target.files));
          e.target.value = ''; // Reset input
        }
      });
    }

    // Drag and drop
    const uploadArea = document.getElementById('uploadArea');
    if (uploadArea) {
      uploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadArea.classList.add('drag-over');
      });

      uploadArea.addEventListener('dragleave', () => {
        uploadArea.classList.remove('drag-over');
      });

      uploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadArea.classList.remove('drag-over');
        
        if (e.dataTransfer.files.length > 0) {
          handleFileUpload(Array.from(e.dataTransfer.files));
        }
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
    } else if (currentDocument.type.startsWith('image/')) {
      alert('该图片尚未进行OCR识别，请等待OCR完成后再生成题库');
      return;
    } else {
      alert('该文件类型不支持自动生成题库，请上传图片或包含OCR文本的文档');
      return;
    }

    // 检查文本长度
    if (text.trim().length < 50) {
      alert('文本内容太少，无法生成题目（至少需要50个字符）');
      return;
    }

    // 显示生成对话框
    showGenerateDialog(text);
  }

  /**
   * 显示生成题库对话框
   */
  function showGenerateDialog(text) {
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
              <input type="number" id="questionCount" min="5" max="50" value="10" />
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
                自动添加到复习计划
              </label>
            </div>

            <div class="form-group">
              <label>
                <input type="checkbox" id="createMockExam" />
                立即生成模拟考试
              </label>
            </div>

            <div class="generate-info">
              <p>📝 文本长度：<strong>${text.length}</strong> 字符</p>
              <p>✨ 将使用AI智能算法从文档内容中提取知识点并生成题目</p>
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
    startBtn.addEventListener('click', () => {
      performQuestionGeneration(text, modal);
    });
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

    const count = parseInt(countInput.value) || 10;
    const module = moduleSelect.value;
    const types = Array.from(typeCheckboxes).map(cb => cb.value);

    if (types.length === 0) {
      alert('请至少选择一种题目类型');
      return;
    }

    // 显示进度
    const form = modal.querySelector('.generate-form');
    const progress = modal.querySelector('#generateProgress');
    const progressFill = progress.querySelector('.progress-fill');
    const progressText = progress.querySelector('.progress-text');
    const startBtn = modal.querySelector('#startGenerate');

    form.style.display = 'none';
    progress.style.display = 'block';
    startBtn.disabled = true;

    try {
      // 模拟进度
      progressText.textContent = '正在分析文档内容...';
      progressFill.style.width = '20%';

      await sleep(500);

      // 调用题目生成器
      if (typeof QuestionGenerator === 'undefined') {
        throw new Error('题目生成器未加载，请刷新页面重试');
      }

      progressText.textContent = '正在提取关键知识点...';
      progressFill.style.width = '40%';

      const questions = QuestionGenerator.generateQuestions(text, {
        module,
        count,
        types
      });

      progressText.textContent = '正在生成题目...';
      progressFill.style.width = '60%';

      await sleep(500);

      // 保存题目到系统
      progressText.textContent = '正在保存到题库...';
      progressFill.style.width = '80%';

      if (typeof window.addGeneratedQuestions === 'function') {
        window.addGeneratedQuestions(questions, {
          addToReview: addToReview.checked,
          createMockExam: createMockExam.checked
        });
      } else {
        console.warn('addGeneratedQuestions 函数未定义');
      }

      progressText.textContent = '✓ 题库生成完成！';
      progressFill.style.width = '100%';

      await sleep(1000);

      // 显示结果
      showGenerationResult(questions, modal, createMockExam.checked);

    } catch (error) {
      console.error('生成题目失败:', error);
      progressText.textContent = '❌ 生成失败: ' + error.message;
      progressFill.style.width = '100%';
      progressFill.style.backgroundColor = 'var(--error-color, #f44336)';

      setTimeout(() => {
        form.style.display = 'block';
        progress.style.display = 'none';
        startBtn.disabled = false;
        progressFill.style.width = '0%';
        progressFill.style.backgroundColor = '';
      }, 3000);
    }
  }

  /**
   * 显示生成结果
   */
  function showGenerationResult(questions, modal, createMockExam) {
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
        <div class="result-actions">
          ${createMockExam ? '<button class="cta-btn" onclick="window.startMockExam && window.startMockExam()">🚀 开始模拟考试</button>' : ''}
          <button class="cta-btn" onclick="window.switchView && window.switchView(\'practice\')">📝 进入练习</button>
          <button class="secondary-btn" onclick="this.closest(\'.modal-overlay\').remove()">关闭</button>
        </div>
      </div>
    `;

    const modalBody = modal.querySelector('.modal-body');
    modalBody.innerHTML = resultHtml;

    const modalFooter = modal.querySelector('.modal-footer');
    modalFooter.style.display = 'none';
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
