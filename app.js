let questionsData = null;
let userProgress = {};
let currentView = 'home';
let examMode = null;
let examTimer = null;

const STORAGE_KEY = 'robotics_learning_progress';

function loadProgress() {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    try {
      userProgress = JSON.parse(stored);
    } catch (e) {
      userProgress = {};
    }
  } else {
    userProgress = {};
  }
}

function saveProgress() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(userProgress));
}

function getQuestionProgress(qid) {
  return userProgress[qid] || { attempted: false, correct: false, attempts: 0 };
}

function updateQuestionProgress(qid, correct) {
  if (!userProgress[qid]) {
    userProgress[qid] = { attempted: false, correct: false, attempts: 0 };
  }
  userProgress[qid].attempted = true;
  userProgress[qid].correct = correct;
  userProgress[qid].attempts++;
  userProgress[qid].lastAttempt = Date.now();
  saveProgress();
}

async function loadQuestions() {
  try {
    const response = await fetch('data/questions.json');
    questionsData = await response.json();
    initialize();
  } catch (error) {
    console.error('Failed to load questions:', error);
    alert('无法加载题库数据，请刷新页面重试');
  }
}

function initialize() {
  loadProgress();
  renderHome();
  updateProgressDisplay();
  setupEventListeners();
}

function setupEventListeners() {
  document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const view = e.target.dataset.view;
      if (view) switchView(view);
    });
  });

  document.querySelectorAll('[data-view]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const view = e.target.dataset.view;
      if (view) switchView(view);
    });
  });

  document.querySelector('.theme-toggle').addEventListener('click', toggleTheme);
  
  document.getElementById('searchInput').addEventListener('input', handleSearch);

  document.querySelector('.modal-close').addEventListener('click', closeModal);
  document.getElementById('questionModal').addEventListener('click', (e) => {
    if (e.target.id === 'questionModal') closeModal();
  });

  document.getElementById('categoryFilter').addEventListener('change', renderPractice);
  document.getElementById('typeFilter').addEventListener('change', renderPractice);
  document.getElementById('resetPractice').addEventListener('click', resetProgress);
  document.getElementById('startExam').addEventListener('click', startExam);
}

function toggleTheme() {
  document.body.classList.toggle('dark');
  localStorage.setItem('theme', document.body.classList.contains('dark') ? 'dark' : 'light');
}

function switchView(view) {
  currentView = view;
  document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
  document.getElementById(`${view}View`).classList.add('active');

  document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));
  document.querySelector(`.nav-btn[data-view="${view}"]`)?.classList.add('active');

  if (view === 'home') renderHome();
  else if (view === 'learn') renderLearn();
  else if (view === 'practice') renderPractice();
  else if (view === 'exam') renderExam();
  else if (view === 'progress') renderProgress();
}

function renderHome() {
  const categoriesContainer = document.getElementById('categoriesContainer');
  categoriesContainer.innerHTML = '';

  questionsData.categories.forEach(cat => {
    const questions = questionsData.questions.filter(q => q.category === cat.id);
    const completed = questions.filter(q => getQuestionProgress(q.id).correct).length;
    const total = questions.length;
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

    const card = document.createElement('div');
    card.className = 'category-card';
    card.innerHTML = `
      <h4>${cat.name}</h4>
      <p style="color: var(--text-muted); margin: 0; font-size: 14px;">${cat.description}</p>
      <div class="category-meta">
        <span>📝 ${total} 题</span>
        <span>✅ ${completed} 完成</span>
        <span>📊 ${percentage}%</span>
      </div>
    `;
    card.addEventListener('click', () => {
      switchView('learn');
      renderLearnCategory(cat.id);
    });
    categoriesContainer.appendChild(card);
  });

  updateProgressDisplay();
}

function renderLearn() {
  const sidebar = document.getElementById('learnSidebar');
  sidebar.innerHTML = '';

  questionsData.categories.forEach(cat => {
    const btn = document.createElement('button');
    btn.textContent = cat.name;
    btn.addEventListener('click', () => {
      document.querySelectorAll('#learnSidebar button').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderLearnCategory(cat.id);
    });
    sidebar.appendChild(btn);
  });

  if (questionsData.categories.length > 0) {
    sidebar.firstChild.click();
  }
}

function renderLearnCategory(catId) {
  const category = questionsData.categories.find(c => c.id === catId);
  const questions = questionsData.questions.filter(q => q.category === catId);
  
  const contentArea = document.getElementById('learnContentArea');
  contentArea.innerHTML = '';

  const moduleCard = document.createElement('div');
  moduleCard.className = 'module-card';
  
  const completed = questions.filter(q => getQuestionProgress(q.id).correct).length;
  const total = questions.length;
  const completionPercent = total > 0 ? Math.round((completed / total) * 100) : 0;

  moduleCard.innerHTML = `
    <div class="module-header">
      <div>
        <h2>${category.name}</h2>
        <p style="color: var(--text-muted); margin: 8px 0 0;">${category.description}</p>
      </div>
      <div style="text-align: right;">
        <div class="stat-number">${completionPercent}%</div>
        <div class="stat-label">完成度</div>
      </div>
    </div>
    <div class="module-body">
      <p>本模块包含 <strong>${total}</strong> 道练习题，涵盖以下题型：</p>
      <ul>
        <li>单选题：${questions.filter(q => q.type === 'single').length} 题</li>
        <li>多选题：${questions.filter(q => q.type === 'multiple').length} 题</li>
        <li>判断题：${questions.filter(q => q.type === 'truefalse').length} 题</li>
      </ul>
      <p>已完成：<strong>${completed}</strong> / ${total} 题</p>
    </div>
    <div class="learning-points">
      <h3 style="margin-bottom: 12px;">核心知识点</h3>
      ${questions.slice(0, 5).map(q => `<div class="learning-point">${q.learningPoint}</div>`).join('')}
    </div>
    <button class="cta-btn" style="margin-top: 24px;" onclick="switchView('practice');document.getElementById('categoryFilter').value='${catId}';renderPractice();">开始练习</button>
  `;

  contentArea.appendChild(moduleCard);
}

function renderPractice() {
  const categoryFilter = document.getElementById('categoryFilter').value;
  const typeFilter = document.getElementById('typeFilter').value;
  
  let filtered = questionsData.questions.filter(q => {
    if (categoryFilter && q.category !== categoryFilter) return false;
    if (typeFilter && q.type !== typeFilter) return false;
    return true;
  });

  const container = document.getElementById('practiceContent');
  container.innerHTML = '';

  const catSelect = document.getElementById('categoryFilter');
  if (catSelect.options.length <= 1) {
    questionsData.categories.forEach(cat => {
      const opt = document.createElement('option');
      opt.value = cat.id;
      opt.textContent = cat.name;
      catSelect.appendChild(opt);
    });
  }

  if (filtered.length === 0) {
    container.innerHTML = '<p style="color: var(--text-muted); text-align: center; padding: 48px;">没有找到匹配的题目</p>';
    return;
  }

  filtered.forEach((q, idx) => {
    const card = document.createElement('div');
    card.className = 'practice-card';
    const progress = getQuestionProgress(q.id);
    const typeText = q.type === 'single' ? '单选题' : q.type === 'multiple' ? '多选题' : '判断题';
    const statusIcon = progress.correct ? '✅' : progress.attempted ? '❌' : '⚪';
    
    card.innerHTML = `
      <h4>${statusIcon} ${typeText} ${idx + 1}. ${q.question}</h4>
      <div id="options-${q.id}">
        ${q.options.map(opt => {
          const inputType = q.type === 'multiple' ? 'checkbox' : 'radio';
          return `
            <label class="option-item">
              <input type="${inputType}" name="q-${q.id}" value="${opt.key}">
              <span>${opt.key}. ${opt.text}</span>
            </label>
          `;
        }).join('')}
      </div>
      <button class="cta-btn" style="margin-top: 12px;" onclick="checkAnswer('${q.id}')">提交答案</button>
      <div class="feedback" id="feedback-${q.id}"></div>
    `;
    container.appendChild(card);
  });
}

function checkAnswer(qid) {
  const question = questionsData.questions.find(q => q.id === qid);
  const inputs = document.querySelectorAll(`input[name="q-${qid}"]:checked`);
  const selected = Array.from(inputs).map(i => i.value).sort().join('');
  const correct = question.correctOptions.slice().sort().join('');
  const isCorrect = selected === correct;

  updateQuestionProgress(qid, isCorrect);

  const feedback = document.getElementById(`feedback-${qid}`);
  feedback.classList.add('show');

  if (isCorrect) {
    feedback.style.background = 'rgba(76, 175, 80, 0.12)';
    feedback.style.borderColor = 'rgba(76, 175, 80, 0.3)';
    feedback.innerHTML = `<strong>✅ 回答正确！</strong><br>${question.explanation}`;
  } else {
    feedback.style.background = 'rgba(220, 38, 38, 0.12)';
    feedback.style.borderColor = 'rgba(220, 38, 38, 0.3)';
    feedback.innerHTML = `<strong>❌ 回答错误</strong><br>${question.explanation}`;
  }

  document.querySelectorAll(`input[name="q-${qid}"]`).forEach(input => {
    const parent = input.closest('.option-item');
    if (question.correctOptions.includes(input.value)) {
      parent.classList.add('correct');
    } else if (input.checked) {
      parent.classList.add('incorrect');
    }
    input.disabled = true;
  });

  updateProgressDisplay();
}

function renderExam() {
  document.getElementById('examContent').innerHTML = `
    <div class="exam-start">
      <h3>准备开始模拟考试</h3>
      <p>考试包含从所有模块随机抽取的30道题（单选10题、多选10题、判断10题）</p>
      <p>建议用时：30分钟</p>
      <button id="startExam" class="cta-btn">开始考试</button>
    </div>
  `;
  document.getElementById('startExam').addEventListener('click', startExam);
  document.getElementById('examTimer').textContent = '00:00:00';
}

function startExam() {
  const singleQuestions = questionsData.questions.filter(q => q.type === 'single');
  const multipleQuestions = questionsData.questions.filter(q => q.type === 'multiple');
  const trueFalseQuestions = questionsData.questions.filter(q => q.type === 'truefalse');

  const shuffleArray = (arr) => arr.sort(() => Math.random() - 0.5);

  const examQuestions = [
    ...shuffleArray([...singleQuestions]).slice(0, 10),
    ...shuffleArray([...multipleQuestions]).slice(0, 10),
    ...shuffleArray([...trueFalseQuestions]).slice(0, 10)
  ];

  examMode = {
    questions: examQuestions,
    answers: {},
    startTime: Date.now()
  };

  renderExamQuestions();
  startExamTimer();
}

function startExamTimer() {
  const timerEl = document.getElementById('examTimer');
  examTimer = setInterval(() => {
    const elapsed = Date.now() - examMode.startTime;
    const hours = Math.floor(elapsed / 3600000);
    const minutes = Math.floor((elapsed % 3600000) / 60000);
    const seconds = Math.floor((elapsed % 60000) / 1000);
    timerEl.textContent = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  }, 1000);
}

function renderExamQuestions() {
  const container = document.getElementById('examContent');
  container.innerHTML = '';

  examMode.questions.forEach((q, idx) => {
    const card = document.createElement('div');
    card.className = 'exam-question';
    const typeText = q.type === 'single' ? '单选题' : q.type === 'multiple' ? '多选题' : '判断题';
    
    card.innerHTML = `
      <h4>${typeText} ${idx + 1}. ${q.question}</h4>
      <div>
        ${q.options.map(opt => {
          const inputType = q.type === 'multiple' ? 'checkbox' : 'radio';
          return `
            <label class="option-item">
              <input type="${inputType}" name="exam-${q.id}" value="${opt.key}">
              <span>${opt.key}. ${opt.text}</span>
            </label>
          `;
        }).join('')}
      </div>
    `;
    container.appendChild(card);
  });

  const submitBtn = document.createElement('button');
  submitBtn.className = 'cta-btn';
  submitBtn.style.marginTop = '24px';
  submitBtn.textContent = '提交试卷';
  submitBtn.addEventListener('click', submitExam);
  container.appendChild(submitBtn);
}

function submitExam() {
  if (!confirm('确定要提交试卷吗？')) return;

  clearInterval(examTimer);
  
  let correctCount = 0;

  examMode.questions.forEach(q => {
    const inputs = document.querySelectorAll(`input[name="exam-${q.id}"]:checked`);
    const selected = Array.from(inputs).map(i => i.value).sort().join('');
    const correct = q.correctOptions.slice().sort().join('');
    if (selected === correct) correctCount++;
  });

  const total = examMode.questions.length;
  const score = Math.round((correctCount / total) * 100);
  const elapsed = Date.now() - examMode.startTime;
  const minutes = Math.floor(elapsed / 60000);
  const seconds = Math.floor((elapsed % 60000) / 1000);

  const container = document.getElementById('examContent');
  container.innerHTML = `
    <div style="text-align: center; padding: 48px;">
      <h2>考试完成！</h2>
      <div class="accuracy-display" style="margin: 24px 0;">${score}</div>
      <p style="font-size: 18px; color: var(--text-muted);">
        正确率：${correctCount} / ${total} 题<br>
        用时：${minutes}分${seconds}秒
      </p>
      <button class="cta-btn" onclick="renderExam()">重新考试</button>
    </div>
  `;
}

function renderProgress() {
  const allQuestions = questionsData.questions;
  const completed = allQuestions.filter(q => getQuestionProgress(q.id).correct);
  const attempted = allQuestions.filter(q => getQuestionProgress(q.id).attempted);
  const correctCount = completed.length;
  const attemptedCount = attempted.length;
  const accuracy = attemptedCount > 0 ? Math.round((correctCount / attemptedCount) * 100) : 0;

  document.getElementById('completedCount').textContent = correctCount;
  document.getElementById('correctCount').textContent = correctCount;
  document.getElementById('attemptedCount').textContent = attemptedCount;
  document.getElementById('accuracyPercent').textContent = accuracy;
  document.getElementById('overallProgress').style.width = `${(correctCount / allQuestions.length) * 100}%`;

  const catProgressList = document.getElementById('categoryProgressList');
  catProgressList.innerHTML = '';

  questionsData.categories.forEach(cat => {
    const questions = allQuestions.filter(q => q.category === cat.id);
    const catCompleted = questions.filter(q => getQuestionProgress(q.id).correct).length;
    const catTotal = questions.length;
    const catPercentage = catTotal > 0 ? Math.round((catCompleted / catTotal) * 100) : 0;

    const item = document.createElement('div');
    item.className = 'category-progress-item';
    item.innerHTML = `
      <h4>${cat.name} <span style="color: var(--text-muted); font-weight: normal;">${catCompleted} / ${catTotal}</span></h4>
      <div class="progress-line">
        <div class="progress-line-fill" style="width: ${catPercentage}%"></div>
      </div>
    `;
    catProgressList.appendChild(item);
  });

  const recentList = document.getElementById('recentActivityList');
  recentList.innerHTML = '';

  const recentAttempts = Object.entries(userProgress)
    .filter(([_, data]) => data.lastAttempt)
    .sort((a, b) => b[1].lastAttempt - a[1].lastAttempt)
    .slice(0, 10);

  if (recentAttempts.length === 0) {
    recentList.innerHTML = '<p style="color: var(--text-muted); text-align: center; padding: 24px;">暂无学习记录</p>';
  } else {
    recentAttempts.forEach(([qid, data]) => {
      const question = allQuestions.find(q => q.id === qid);
      if (!question) return;

      const item = document.createElement('div');
      item.className = 'activity-item';
      const icon = data.correct ? '✅' : '❌';
      const timeAgo = getTimeAgo(data.lastAttempt);
      item.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <span>${icon} ${question.question.substring(0, 50)}${question.question.length > 50 ? '...' : ''}</span>
          <span style="color: var(--text-muted); font-size: 13px;">${timeAgo}</span>
        </div>
      `;
      recentList.appendChild(item);
    });
  }
}

function getTimeAgo(timestamp) {
  const seconds = Math.floor((Date.now() - timestamp) / 1000);
  if (seconds < 60) return '刚刚';
  if (seconds < 3600) return `${Math.floor(seconds / 60)}分钟前`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}小时前`;
  return `${Math.floor(seconds / 86400)}天前`;
}

function updateProgressDisplay() {
  if (!questionsData) return;
  
  const completed = questionsData.questions.filter(q => getQuestionProgress(q.id).correct).length;
  const total = questionsData.questions.length;
  const percentage = Math.round((completed / total) * 100);

  const percentEl = document.getElementById('progressPercent');
  if (percentEl) {
    percentEl.textContent = `${percentage}%`;
  }
}

function resetProgress() {
  if (!confirm('确定要重置所有学习进度吗？此操作不可撤销。')) return;
  
  userProgress = {};
  saveProgress();
  alert('学习进度已重置');
  renderPractice();
  updateProgressDisplay();
}

function handleSearch(e) {
  const query = e.target.value.toLowerCase().trim();
  if (query.length < 2) return;

  const results = questionsData.questions.filter(q => 
    q.question.toLowerCase().includes(query) ||
    q.options.some(opt => opt.text.toLowerCase().includes(query))
  );

  console.log(`Found ${results.length} results for "${query}"`);
}

function closeModal() {
  document.getElementById('questionModal').classList.remove('show');
}

if (localStorage.getItem('theme') === 'dark') {
  document.body.classList.add('dark');
}

loadQuestions();
