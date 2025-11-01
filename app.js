let questionsData = null;
let tutorialsData = null;
let userProgress = {};
let lessonProgress = {};
let currentView = 'home';
let currentTutorialCategory = null;
let currentTutorialLesson = null;
let examMode = null;
let examTimer = null;

const QUESTION_PROGRESS_KEY = 'robotics_learning_progress';
const LESSON_PROGRESS_KEY = 'robotics_learning_lessons';

function loadQuestionProgress() {
  const stored = localStorage.getItem(QUESTION_PROGRESS_KEY);
  if (stored) {
    try {
      userProgress = JSON.parse(stored);
    } catch (error) {
      console.warn('Failed to parse question progress, resetting.', error);
      userProgress = {};
    }
  } else {
    userProgress = {};
  }
}

function saveQuestionProgress() {
  localStorage.setItem(QUESTION_PROGRESS_KEY, JSON.stringify(userProgress));
}

function loadLessonProgress() {
  const stored = localStorage.getItem(LESSON_PROGRESS_KEY);
  if (stored) {
    try {
      lessonProgress = JSON.parse(stored);
    } catch (error) {
      console.warn('Failed to parse lesson progress, resetting.', error);
      lessonProgress = {};
    }
  } else {
    lessonProgress = {};
  }
}

function saveLessonProgress() {
  localStorage.setItem(LESSON_PROGRESS_KEY, JSON.stringify(lessonProgress));
}

function getQuestionProgress(qid) {
  return userProgress[qid] || { attempted: false, correct: false, attempts: 0 };
}

function isLessonCompleted(lessonId) {
  return Boolean(lessonProgress[lessonId]?.completed);
}

function markLessonCompleted(lessonId) {
  if (!lessonId) return;
  lessonProgress[lessonId] = {
    completed: true,
    completedAt: Date.now()
  };
  saveLessonProgress();
}

function getLessonStats(categoryId) {
  if (!tutorialsData) return { total: 0, completed: 0 };
  const module = tutorialsData.tutorials.find((item) => item.categoryId === categoryId);
  if (!module) return { total: 0, completed: 0 };
  const total = module.lessons.length;
  const completed = module.lessons.filter((lesson) => isLessonCompleted(lesson.id)).length;
  return { total, completed };
}

function updateQuestionProgress(qid, correct) {
  if (!userProgress[qid]) {
    userProgress[qid] = { attempted: false, correct: false, attempts: 0 };
  }
  userProgress[qid].attempted = true;
  userProgress[qid].correct = correct;
  userProgress[qid].attempts += 1;
  userProgress[qid].lastAttempt = Date.now();
  saveQuestionProgress();
}

async function loadData() {
  try {
    const [questionResponse, tutorialResponse] = await Promise.all([
      fetch('data/questions.json'),
      fetch('data/tutorials.json')
    ]);

    questionsData = await questionResponse.json();
    tutorialsData = await tutorialResponse.json();
    initialize();
  } catch (error) {
    console.error('Failed to load learning data:', error);
    alert('无法加载学习资源，请检查网络后刷新页面重试');
  }
}

function initialize() {
  loadQuestionProgress();
  loadLessonProgress();
  renderHome();
  updateProgressDisplay();
  setupEventListeners();
}

function setupEventListeners() {
  document.querySelectorAll('.nav-btn').forEach((btn) => {
    btn.addEventListener('click', (event) => {
      const view = event.currentTarget.dataset.view;
      if (view) {
        switchView(view);
      }
    });
  });

  document.querySelectorAll('[data-view]').forEach((btn) => {
    btn.addEventListener('click', (event) => {
      const view = event.currentTarget.dataset.view;
      if (view) {
        switchView(view);
      }
    });
  });

  document.querySelector('.theme-toggle')?.addEventListener('click', toggleTheme);

  document.getElementById('searchInput')?.addEventListener('input', handleSearch);

  document.querySelector('.modal-close')?.addEventListener('click', closeModal);
  document.getElementById('questionModal')?.addEventListener('click', (event) => {
    if (event.target.id === 'questionModal') closeModal();
  });

  document.getElementById('categoryFilter')?.addEventListener('change', renderPractice);
  document.getElementById('typeFilter')?.addEventListener('change', renderPractice);
  document.getElementById('resetPractice')?.addEventListener('click', resetProgress);
  document.getElementById('startExam')?.addEventListener('click', startExam);
}

function toggleTheme() {
  document.body.classList.toggle('dark');
  localStorage.setItem('theme', document.body.classList.contains('dark') ? 'dark' : 'light');
}

function switchView(view) {
  currentView = view;
  document.querySelectorAll('.view').forEach((element) => element.classList.remove('active'));
  document.getElementById(`${view}View`)?.classList.add('active');

  document.querySelectorAll('.nav-btn').forEach((btn) => btn.classList.remove('active'));
  document.querySelector(`.nav-btn[data-view="${view}"]`)?.classList.add('active');

  if (view === 'home') {
    renderHome();
  } else if (view === 'learn') {
    renderLearn();
  } else if (view === 'tutorial') {
    renderTutorial();
  } else if (view === 'practice') {
    renderPractice();
  } else if (view === 'exam') {
    renderExam();
  } else if (view === 'progress') {
    renderProgress();
  }
}

function renderHome() {
  if (!questionsData) return;
  const categoriesContainer = document.getElementById('categoriesContainer');
  categoriesContainer.innerHTML = '';

  questionsData.categories.forEach((category) => {
    const questions = questionsData.questions.filter((question) => question.category === category.id);
    const completed = questions.filter((question) => getQuestionProgress(question.id).correct).length;
    const total = questions.length;
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
    const lessonStats = getLessonStats(category.id);

    const card = document.createElement('div');
    card.className = 'category-card';
    card.innerHTML = `
      <h4>${category.name}</h4>
      <p class="category-description">${category.description}</p>
      <div class="category-meta">
        <span>📝 ${total} 题</span>
        <span>✅ ${completed} 完成</span>
        <span>📊 ${percentage}%</span>
      </div>
      <div class="category-lessons">
        <span>📚 教程 ${lessonStats.completed} / ${lessonStats.total}</span>
      </div>
      <div class="category-actions">
        <button class="secondary-btn category-btn" data-action="tutorial" data-category="${category.id}">交互教程</button>
        <button class="cta-btn category-btn" data-action="practice" data-category="${category.id}">开始练习</button>
      </div>
    `;

    card.querySelectorAll('.category-btn').forEach((btn) => {
      btn.addEventListener('click', (event) => {
        event.stopPropagation();
        const action = event.currentTarget.dataset.action;
        if (action === 'tutorial') {
          openTutorial(category.id);
        } else if (action === 'practice') {
          switchView('practice');
          document.getElementById('categoryFilter').value = category.id;
          document.getElementById('typeFilter').value = '';
          renderPractice();
        }
      });
    });

    card.addEventListener('click', () => {
      switchView('learn');
      renderLearnCategory(category.id);
    });

    categoriesContainer.appendChild(card);
  });

  updateProgressDisplay();
}

function renderLearn() {
  if (!questionsData) return;
  const sidebar = document.getElementById('learnSidebar');
  sidebar.innerHTML = '';

  questionsData.categories.forEach((category) => {
    const button = document.createElement('button');
    button.textContent = category.name;
    button.addEventListener('click', () => {
      document.querySelectorAll('#learnSidebar button').forEach((btn) => btn.classList.remove('active'));
      button.classList.add('active');
      renderLearnCategory(category.id);
    });
    sidebar.appendChild(button);
  });

  if (questionsData.categories.length > 0) {
    sidebar.firstChild?.click();
  }
}

function renderLearnCategory(categoryId) {
  if (!questionsData) return;

  const category = questionsData.categories.find((item) => item.id === categoryId);
  if (!category) return;

  const questions = questionsData.questions.filter((question) => question.category === categoryId);
  const contentArea = document.getElementById('learnContentArea');
  contentArea.innerHTML = '';

  const moduleCard = document.createElement('div');
  moduleCard.className = 'module-card';

  const header = document.createElement('div');
  header.className = 'module-header';

  const titleBox = document.createElement('div');
  const title = document.createElement('h2');
  title.textContent = category.name;
  const description = document.createElement('p');
  description.className = 'module-description';
  description.textContent = category.description;

  titleBox.appendChild(title);
  titleBox.appendChild(description);

  const statsBox = document.createElement('div');
  statsBox.className = 'module-stats';

  const completed = questions.filter((question) => getQuestionProgress(question.id).correct).length;
  const total = questions.length;
  const completionPercent = total > 0 ? Math.round((completed / total) * 100) : 0;
  const lessonStats = getLessonStats(categoryId);
  const lessonPercent = lessonStats.total > 0 ? Math.round((lessonStats.completed / lessonStats.total) * 100) : 0;

  statsBox.innerHTML = `
    <div class="module-stat">
      <div class="stat-number">${completionPercent}%</div>
      <div class="stat-label">练习完成度</div>
    </div>
    <div class="module-stat">
      <div class="stat-number">${lessonPercent}%</div>
      <div class="stat-label">教程完成度</div>
    </div>
  `;

  header.appendChild(titleBox);
  header.appendChild(statsBox);

  const body = document.createElement('div');
  body.className = 'module-body';
  body.innerHTML = `
    <p>本模块包含 <strong>${total}</strong> 道练习题，涵盖以下题型：</p>
    <ul>
      <li>单选题：${questions.filter((question) => question.type === 'single').length} 题</li>
      <li>多选题：${questions.filter((question) => question.type === 'multiple').length} 题</li>
      <li>判断题：${questions.filter((question) => question.type === 'truefalse').length} 题</li>
    </ul>
    <p>已完成：<strong>${completed}</strong> / ${total} 题</p>
  `;

  const learningPoints = [];
  questions.forEach((question) => {
    if (question.learningPoint && !learningPoints.includes(question.learningPoint)) {
      learningPoints.push(question.learningPoint);
    }
  });

  const pointsSection = document.createElement('div');
  pointsSection.className = 'learning-points';
  pointsSection.innerHTML = '<h3>核心知识点</h3>';

  if (learningPoints.length > 0) {
    learningPoints.slice(0, 6).forEach((point) => {
      const pointItem = document.createElement('div');
      pointItem.className = 'learning-point';
      pointItem.innerText = point;
      pointsSection.appendChild(pointItem);
    });
  } else {
    const empty = document.createElement('p');
    empty.className = 'learning-point-empty';
    empty.textContent = '本模块的核心知识点将随题目练习自动总结。';
    pointsSection.appendChild(empty);
  }

  const tutorialModule = tutorialsData?.tutorials.find((item) => item.categoryId === categoryId);
  if (tutorialModule) {
    const roadmap = document.createElement('div');
    roadmap.className = 'module-roadmap';
    roadmap.innerHTML = '<h3>交互式学习路径</h3>';

    const list = document.createElement('div');
    list.className = 'module-roadmap-list';

    tutorialModule.lessons.forEach((lesson, index) => {
      const lessonItem = document.createElement('div');
      lessonItem.className = 'roadmap-item';
      if (isLessonCompleted(lesson.id)) {
        lessonItem.classList.add('completed');
      }
      lessonItem.innerHTML = `
        <div class="roadmap-index">${String(index + 1).padStart(2, '0')}</div>
        <div class="roadmap-body">
          <div class="roadmap-title">${lesson.title}</div>
          <div class="roadmap-description">${lesson.description}</div>
        </div>
        <button class="secondary-btn roadmap-btn" data-lesson="${lesson.id}">学习</button>
      `;
      lessonItem.querySelector('.roadmap-btn').addEventListener('click', () => {
        openTutorial(categoryId, lesson.id);
      });
      list.appendChild(lessonItem);
    });

    roadmap.appendChild(list);
    pointsSection.appendChild(roadmap);
  }

  const actions = document.createElement('div');
  actions.className = 'module-actions';

  const practiceButton = document.createElement('button');
  practiceButton.className = 'cta-btn';
  practiceButton.textContent = '进入针对性练习';
  practiceButton.addEventListener('click', () => {
    switchView('practice');
    document.getElementById('categoryFilter').value = categoryId;
    document.getElementById('typeFilter').value = '';
    renderPractice();
  });

  const tutorialButton = document.createElement('button');
  tutorialButton.className = 'secondary-btn';
  tutorialButton.textContent = '进入交互教程';
  tutorialButton.addEventListener('click', () => openTutorial(categoryId));

  actions.appendChild(tutorialButton);
  actions.appendChild(practiceButton);

  moduleCard.appendChild(header);
  moduleCard.appendChild(body);
  moduleCard.appendChild(pointsSection);
  moduleCard.appendChild(actions);

  contentArea.appendChild(moduleCard);
}

function openTutorial(categoryId, lessonId = null) {
  currentTutorialCategory = categoryId;
  currentTutorialLesson = lessonId;
  switchView('tutorial');
}

function renderTutorial() {
  if (!tutorialsData) {
    const tutorialSidebar = document.getElementById('tutorialSidebar');
    const tutorialContentArea = document.getElementById('tutorialContentArea');
    tutorialSidebar.innerHTML = '';
    tutorialContentArea.innerHTML = '<p class="tutorial-empty">暂未加载到交互式教程内容。</p>';
    return;
  }

  const modules = tutorialsData.tutorials || [];
  const sidebar = document.getElementById('tutorialSidebar');
  const contentArea = document.getElementById('tutorialContentArea');

  if (!modules.length) {
    sidebar.innerHTML = '';
    contentArea.innerHTML = '<p class="tutorial-empty">教程资源正在建设中，敬请期待。</p>';
    return;
  }

  if (!currentTutorialCategory) {
    currentTutorialCategory = modules[0].categoryId;
  }

  const activeModule = modules.find((module) => module.categoryId === currentTutorialCategory) || modules[0];
  if (!currentTutorialLesson) {
    currentTutorialLesson = activeModule.lessons[0]?.id || null;
  }

  sidebar.innerHTML = '';
  modules.forEach((module) => {
    const moduleStats = getLessonStats(module.categoryId);
    const moduleContainer = document.createElement('div');
    moduleContainer.className = 'tutorial-module';
    if (module.categoryId === activeModule.categoryId) {
      moduleContainer.classList.add('active');
    }

    const header = document.createElement('button');
    header.className = 'tutorial-module-header';
    header.innerHTML = `
      <span>${module.categoryName}</span>
      <span class="module-progress-badge">${moduleStats.completed}/${moduleStats.total}</span>
    `;
    header.addEventListener('click', () => {
      currentTutorialCategory = module.categoryId;
      currentTutorialLesson = module.lessons[0]?.id || null;
      renderTutorial();
    });

    const lessonsContainer = document.createElement('div');
    lessonsContainer.className = 'tutorial-lesson-list';

    module.lessons.forEach((lesson) => {
      const lessonButton = document.createElement('button');
      lessonButton.className = 'tutorial-lesson-item';
      if (lesson.id === currentTutorialLesson && module.categoryId === activeModule.categoryId) {
        lessonButton.classList.add('active');
      }
      if (isLessonCompleted(lesson.id)) {
        lessonButton.classList.add('completed');
      }
      lessonButton.innerHTML = `
        <span class="lesson-title">${lesson.title}</span>
        <span class="lesson-status">${isLessonCompleted(lesson.id) ? '已完成' : '待学习'}</span>
      `;
      lessonButton.addEventListener('click', () => {
        currentTutorialCategory = module.categoryId;
        currentTutorialLesson = lesson.id;
        renderTutorial();
      });
      lessonsContainer.appendChild(lessonButton);
    });

    moduleContainer.appendChild(header);
    moduleContainer.appendChild(lessonsContainer);
    sidebar.appendChild(moduleContainer);
  });

  renderTutorialLesson(activeModule, currentTutorialLesson);
}

function renderTutorialLesson(module, lessonId) {
  const lesson = module.lessons.find((item) => item.id === lessonId) || module.lessons[0];
  const contentArea = document.getElementById('tutorialContentArea');

  if (!lesson) {
    contentArea.innerHTML = '<p class="tutorial-empty">请选择左侧的课程开始学习。</p>';
    return;
  }

  currentTutorialLesson = lesson.id;
  contentArea.innerHTML = '';

  const lessonHeader = document.createElement('div');
  lessonHeader.className = 'lesson-header';
  lessonHeader.innerHTML = `
    <div class="lesson-breadcrumb">${module.categoryName} · 交互式教程</div>
    <h2 class="lesson-title">${lesson.title}</h2>
    <p class="lesson-description">${lesson.description}</p>
  `;

  const actions = document.createElement('div');
  actions.className = 'lesson-actions';

  const statusBadge = document.createElement('span');
  statusBadge.className = 'lesson-status-badge';
  statusBadge.textContent = isLessonCompleted(lesson.id) ? '✅ 已完成' : '🌱 学习中';
  actions.appendChild(statusBadge);

  const completeButton = document.createElement('button');
  completeButton.className = isLessonCompleted(lesson.id) ? 'secondary-btn disabled' : 'cta-btn';
  completeButton.textContent = isLessonCompleted(lesson.id) ? '已掌握本课' : '标记为已掌握';
  completeButton.disabled = isLessonCompleted(lesson.id);
  completeButton.addEventListener('click', () => {
    markLessonCompleted(lesson.id);
    renderTutorial();
  });
  actions.appendChild(completeButton);

  lessonHeader.appendChild(actions);
  contentArea.appendChild(lessonHeader);

  const lessonBody = document.createElement('div');
  lessonBody.className = 'lesson-body';

  lesson.content.forEach((block, index) => {
    const blockElement = renderLessonBlock(block, lesson.id, index);
    if (blockElement) {
      lessonBody.appendChild(blockElement);
    }
  });

  contentArea.appendChild(lessonBody);
  contentArea.appendChild(renderLessonNavigation(module, lesson.id));
}

function renderLessonBlock(block, lessonId, index) {
  const container = document.createElement('section');
  container.className = `lesson-block block-${block.type}`;
  container.dataset.blockIndex = index;

  if (block.title) {
    const title = document.createElement('h3');
    title.className = 'lesson-block-title';
    title.textContent = block.title;
    container.appendChild(title);
  }

  if (block.type === 'text') {
    const content = document.createElement('div');
    content.className = 'lesson-block-text';
    content.innerHTML = formatLessonText(block.content || '');
    container.appendChild(content);
    return container;
  }

  if (block.type === 'code') {
    const toolbar = document.createElement('div');
    toolbar.className = 'code-toolbar';
    const languageBadge = document.createElement('span');
    languageBadge.className = 'code-language';
    languageBadge.textContent = block.language?.toUpperCase() || 'CODE';
    toolbar.appendChild(languageBadge);

    const copyButton = document.createElement('button');
    copyButton.type = 'button';
    copyButton.className = 'secondary-btn code-copy-btn';
    copyButton.textContent = '复制代码';
    copyButton.addEventListener('click', () => copyToClipboard(block.code, copyButton));
    toolbar.appendChild(copyButton);
    container.appendChild(toolbar);

    const pre = document.createElement('pre');
    const code = document.createElement('code');
    code.textContent = block.code || '';
    pre.appendChild(code);
    container.appendChild(pre);

    if (block.explanation) {
      const explanation = document.createElement('div');
      explanation.className = 'code-explanation';
      explanation.innerHTML = formatLessonText(block.explanation);
      container.appendChild(explanation);
    }
    return container;
  }

  if (block.type === 'interactive') {
    container.classList.add('interactive-block');

    const task = document.createElement('div');
    task.className = 'interactive-task';
    task.innerHTML = formatLessonText(block.task || '');
    container.appendChild(task);

    const actions = document.createElement('div');
    actions.className = 'interactive-actions';

    if (block.hint) {
      const hintButton = document.createElement('button');
      hintButton.className = 'secondary-btn';
      hintButton.textContent = '查看提示';
      const hintBox = document.createElement('div');
      hintBox.className = 'interactive-hint hidden';
      hintBox.innerHTML = formatLessonText(block.hint);
      hintButton.addEventListener('click', () => {
        hintBox.classList.toggle('hidden');
        hintButton.textContent = hintBox.classList.contains('hidden') ? '查看提示' : '收起提示';
      });
      actions.appendChild(hintButton);
      container.appendChild(hintBox);
    }

    if (block.solution) {
      const solutionButton = document.createElement('button');
      solutionButton.className = 'secondary-btn';
      solutionButton.textContent = '查看解析';
      const solutionBox = document.createElement('div');
      solutionBox.className = 'interactive-solution hidden';
      solutionBox.innerHTML = formatLessonText(block.solution);
      solutionButton.addEventListener('click', () => {
        solutionBox.classList.toggle('hidden');
        solutionButton.textContent = solutionBox.classList.contains('hidden') ? '查看解析' : '收起解析';
      });
      actions.appendChild(solutionButton);
      container.appendChild(solutionBox);
    }

    container.appendChild(actions);

    if (block.exercise) {
      const exerciseBox = document.createElement('div');
      exerciseBox.className = 'interactive-exercise';
      exerciseBox.innerHTML = `
        <div class="exercise-title">自测题：${block.exercise.question}</div>
        <div class="exercise-input">
          <input type="text" placeholder="输入答案" aria-label="练习题答案">
          <button class="cta-btn">提交</button>
        </div>
        <div class="exercise-feedback" aria-live="polite"></div>
      `;

      const input = exerciseBox.querySelector('input');
      const submit = exerciseBox.querySelector('button');
      const feedback = exerciseBox.querySelector('.exercise-feedback');

      submit.addEventListener('click', () => {
        const userAnswer = (input.value || '').trim().toLowerCase();
        const correctAnswer = String(block.exercise.answer).trim().toLowerCase();
        if (!userAnswer) {
          feedback.textContent = '请输入答案后再提交。';
          feedback.className = 'exercise-feedback warning';
          input.focus();
          return;
        }
        if (userAnswer === correctAnswer) {
          feedback.textContent = '🎉 回答正确！已记录本课掌握情况。';
          feedback.className = 'exercise-feedback success';
          markLessonCompleted(lessonId);
          renderTutorial();
        } else {
          feedback.textContent = '再想一想，还可以查看上方提示或解析。';
          feedback.className = 'exercise-feedback danger';
        }
      });

      container.appendChild(exerciseBox);
    }

    return container;
  }

  if (block.type === 'keypoints') {
    const list = document.createElement('ul');
    list.className = 'lesson-keypoints';
    (block.points || []).forEach((point) => {
      const item = document.createElement('li');
      item.innerHTML = formatLessonText(point);
      list.appendChild(item);
    });
    container.appendChild(list);
    return container;
  }

  return null;
}

function renderLessonNavigation(module, lessonId) {
  const navigation = document.createElement('div');
  navigation.className = 'lesson-navigation';

  const lessons = module.lessons;
  const currentIndex = lessons.findIndex((item) => item.id === lessonId);
  const prevLesson = currentIndex > 0 ? lessons[currentIndex - 1] : null;
  const nextLesson = currentIndex < lessons.length - 1 ? lessons[currentIndex + 1] : null;

  const left = document.createElement('div');
  left.className = 'nav-side';
  if (prevLesson) {
    const button = document.createElement('button');
    button.className = 'secondary-btn';
    button.textContent = `← 上一课：${prevLesson.title}`;
    button.addEventListener('click', () => {
      currentTutorialLesson = prevLesson.id;
      renderTutorial();
    });
    left.appendChild(button);
  } else {
    const placeholder = document.createElement('span');
    placeholder.className = 'nav-placeholder';
    placeholder.textContent = '已是第一课';
    left.appendChild(placeholder);
  }

  const right = document.createElement('div');
  right.className = 'nav-side';
  if (nextLesson) {
    const button = document.createElement('button');
    button.className = 'cta-btn';
    button.textContent = `下一课：${nextLesson.title} →`;
    button.addEventListener('click', () => {
      currentTutorialLesson = nextLesson.id;
      renderTutorial();
    });
    right.appendChild(button);
  } else {
    const placeholder = document.createElement('span');
    placeholder.className = 'nav-placeholder';
    placeholder.textContent = '已完成本模块全部课程';
    right.appendChild(placeholder);
  }

  navigation.appendChild(left);
  navigation.appendChild(right);
  return navigation;
}

function copyToClipboard(text, button) {
  navigator.clipboard?.writeText(text).then(() => {
    const original = button.textContent;
    button.textContent = '已复制';
    button.disabled = true;
    setTimeout(() => {
      button.textContent = original;
      button.disabled = false;
    }, 2000);
  }).catch(() => {
    alert('复制失败，请手动选择文本复制。');
  });
}

function escapeHtml(value) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function formatInlineMarkdown(value) {
  return value
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/`([^`]+)`/g, '<code>$1</code>');
}

function formatLessonText(text) {
  if (!text) return '';

  const lines = text.split('\n');
  let html = '';
  let inUnorderedList = false;
  let inOrderedList = false;
  let inCodeBlock = false;
  let currentParagraph = '';

  const flushParagraph = () => {
    if (currentParagraph.trim()) {
      html += `<p>${formatInlineMarkdown(currentParagraph.trim())}</p>`;
    }
    currentParagraph = '';
  };

  lines.forEach((line) => {
    const trimmed = line.trim();

    if (trimmed.startsWith('```')) {
      flushParagraph();
      if (inUnorderedList) {
        html += '</ul>';
        inUnorderedList = false;
      }
      if (inOrderedList) {
        html += '</ol>';
        inOrderedList = false;
      }
      if (!inCodeBlock) {
        html += '<pre class="lesson-inline-code"><code>';
        inCodeBlock = true;
      } else {
        html += '</code></pre>';
        inCodeBlock = false;
      }
      return;
    }

    if (inCodeBlock) {
      html += `${escapeHtml(line)}\n`;
      return;
    }

    if (!trimmed) {
      flushParagraph();
      if (inUnorderedList) {
        html += '</ul>';
        inUnorderedList = false;
      }
      if (inOrderedList) {
        html += '</ol>';
        inOrderedList = false;
      }
      return;
    }

    if (trimmed.startsWith('- ')) {
      flushParagraph();
      if (!inUnorderedList) {
        if (inOrderedList) {
          html += '</ol>';
          inOrderedList = false;
        }
        html += '<ul>';
        inUnorderedList = true;
      }
      html += `<li>${formatInlineMarkdown(trimmed.slice(2))}</li>`;
      return;
    }

    if (/^\d+\.\s/.test(trimmed)) {
      flushParagraph();
      if (!inOrderedList) {
        if (inUnorderedList) {
          html += '</ul>';
          inUnorderedList = false;
        }
        html += '<ol>';
        inOrderedList = true;
      }
      html += `<li>${formatInlineMarkdown(trimmed.replace(/^\d+\.\s/, ''))}</li>`;
      return;
    }

    if (inUnorderedList) {
      html += '</ul>';
      inUnorderedList = false;
    }
    if (inOrderedList) {
      html += '</ol>';
      inOrderedList = false;
    }

    currentParagraph += (currentParagraph ? ' ' : '') + trimmed;
  });

  flushParagraph();
  if (inUnorderedList) html += '</ul>';
  if (inOrderedList) html += '</ol>';
  if (inCodeBlock) html += '</code></pre>';

  return html;
}

function renderPractice() {
  if (!questionsData) return;

  const categoryFilter = document.getElementById('categoryFilter').value;
  const typeFilter = document.getElementById('typeFilter').value;

  const filteredQuestions = questionsData.questions.filter((question) => {
    if (categoryFilter && question.category !== categoryFilter) return false;
    if (typeFilter && question.type !== typeFilter) return false;
    return true;
  });

  const container = document.getElementById('practiceContent');
  container.innerHTML = '';

  const categorySelect = document.getElementById('categoryFilter');
  if (categorySelect.options.length <= 1) {
    questionsData.categories.forEach((category) => {
      const option = document.createElement('option');
      option.value = category.id;
      option.textContent = category.name;
      categorySelect.appendChild(option);
    });
  }

  if (filteredQuestions.length === 0) {
    container.innerHTML = '<p class="practice-empty">没有找到匹配的题目，可以尝试调整筛选条件。</p>';
    return;
  }

  filteredQuestions.forEach((question, index) => {
    const card = document.createElement('div');
    card.className = 'practice-card';

    const progress = getQuestionProgress(question.id);
    const typeText = question.type === 'single' ? '单选题' : question.type === 'multiple' ? '多选题' : '判断题';
    const statusIcon = progress.correct ? '✅' : progress.attempted ? '❌' : '⚪';

    const optionsHtml = question.options.map((option) => {
      const inputType = question.type === 'multiple' ? 'checkbox' : 'radio';
      return `
        <label class="option-item">
          <input type="${inputType}" name="q-${question.id}" value="${option.key}">
          <span>${option.key}. ${option.text}</span>
        </label>
      `;
    }).join('');

    card.innerHTML = `
      <h4>${statusIcon} ${typeText} ${index + 1}. ${question.question}</h4>
      <div class="practice-options" id="options-${question.id}">${optionsHtml}</div>
      <button class="cta-btn" data-question="${question.id}">提交答案</button>
      <div class="feedback" id="feedback-${question.id}"></div>
    `;

    card.querySelector('button').addEventListener('click', () => checkAnswer(question.id));

    container.appendChild(card);
  });
}

function checkAnswer(questionId) {
  const question = questionsData.questions.find((item) => item.id === questionId);
  if (!question) return;

  const inputs = document.querySelectorAll(`input[name="q-${questionId}"]:checked`);
  const selected = Array.from(inputs).map((input) => input.value).sort().join('');
  const correct = question.correctOptions.slice().sort().join('');
  const isCorrect = selected === correct;

  updateQuestionProgress(questionId, isCorrect);

  const feedback = document.getElementById(`feedback-${questionId}`);
  feedback.classList.add('show');

  if (isCorrect) {
    feedback.classList.remove('error');
    feedback.classList.add('success');
    feedback.innerHTML = `<strong>✅ 回答正确！</strong><br>${question.explanation}`;
  } else {
    feedback.classList.remove('success');
    feedback.classList.add('error');
    feedback.innerHTML = `<strong>❌ 回答错误</strong><br>${question.explanation}`;
  }

  document.querySelectorAll(`input[name="q-${questionId}"]`).forEach((input) => {
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
  const examContent = document.getElementById('examContent');
  examContent.innerHTML = `
    <div class="exam-start">
      <h3>准备开始模拟考试</h3>
      <p>考试包含从所有模块随机抽取的30道题（单选10题、多选10题、判断10题）</p>
      <p>建议用时：30分钟</p>
      <button id="startExam" class="cta-btn">开始考试</button>
    </div>
  `;
  document.getElementById('startExam')?.addEventListener('click', startExam);
  document.getElementById('examTimer').textContent = '00:00:00';
}

function startExam() {
  const singles = questionsData.questions.filter((question) => question.type === 'single');
  const multiples = questionsData.questions.filter((question) => question.type === 'multiple');
  const trueFalse = questionsData.questions.filter((question) => question.type === 'truefalse');

  const shuffle = (array) => array.sort(() => Math.random() - 0.5);

  const examQuestions = [
    ...shuffle([...singles]).slice(0, 10),
    ...shuffle([...multiples]).slice(0, 10),
    ...shuffle([...trueFalse]).slice(0, 10)
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
  const timerElement = document.getElementById('examTimer');
  clearInterval(examTimer);
  examTimer = setInterval(() => {
    const elapsed = Date.now() - examMode.startTime;
    const hours = Math.floor(elapsed / 3600000);
    const minutes = Math.floor((elapsed % 3600000) / 60000);
    const seconds = Math.floor((elapsed % 60000) / 1000);
    timerElement.textContent = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  }, 1000);
}

function renderExamQuestions() {
  const container = document.getElementById('examContent');
  container.innerHTML = '';

  examMode.questions.forEach((question, index) => {
    const card = document.createElement('div');
    card.className = 'exam-question';
    const typeText = question.type === 'single' ? '单选题' : question.type === 'multiple' ? '多选题' : '判断题';

    const optionsHtml = question.options.map((option) => {
      const inputType = question.type === 'multiple' ? 'checkbox' : 'radio';
      return `
        <label class="option-item">
          <input type="${inputType}" name="exam-${question.id}" value="${option.key}">
          <span>${option.key}. ${option.text}</span>
        </label>
      `;
    }).join('');

    card.innerHTML = `
      <h4>${typeText} ${index + 1}. ${question.question}</h4>
      <div>${optionsHtml}</div>
    `;

    container.appendChild(card);
  });

  const submitButton = document.createElement('button');
  submitButton.className = 'cta-btn exam-submit';
  submitButton.textContent = '提交试卷';
  submitButton.addEventListener('click', submitExam);
  container.appendChild(submitButton);
}

function submitExam() {
  if (!confirm('确定要提交试卷吗？')) return;

  clearInterval(examTimer);
  let correctCount = 0;

  examMode.questions.forEach((question) => {
    const inputs = document.querySelectorAll(`input[name="exam-${question.id}"]:checked`);
    const selected = Array.from(inputs).map((input) => input.value).sort().join('');
    const correct = question.correctOptions.slice().sort().join('');
    if (selected === correct) correctCount += 1;
  });

  const total = examMode.questions.length;
  const score = Math.round((correctCount / total) * 100);
  const elapsed = Date.now() - examMode.startTime;
  const minutes = Math.floor(elapsed / 60000);
  const seconds = Math.floor((elapsed % 60000) / 1000);

  const container = document.getElementById('examContent');
  container.innerHTML = `
    <div class="exam-result">
      <h2>考试完成！</h2>
      <div class="exam-score">${score}</div>
      <p>正确率：${correctCount} / ${total} 题</p>
      <p>用时：${minutes}分${seconds}秒</p>
      <button class="cta-btn" id="restartExam">重新考试</button>
    </div>
  `;

  document.getElementById('restartExam')?.addEventListener('click', renderExam);
}

function renderProgress() {
  if (!questionsData) return;

  const allQuestions = questionsData.questions;
  const completedQuestions = allQuestions.filter((question) => getQuestionProgress(question.id).correct);
  const attemptedQuestions = allQuestions.filter((question) => getQuestionProgress(question.id).attempted);
  const correctCount = completedQuestions.length;
  const attemptedCount = attemptedQuestions.length;
  const accuracy = attemptedCount > 0 ? Math.round((correctCount / attemptedCount) * 100) : 0;

  document.getElementById('completedCount').textContent = correctCount;
  document.getElementById('correctCount').textContent = correctCount;
  document.getElementById('attemptedCount').textContent = attemptedCount;
  document.getElementById('accuracyPercent').textContent = accuracy;
  document.getElementById('overallProgress').style.width = `${(correctCount / allQuestions.length) * 100}%`;

  const categoryProgressList = document.getElementById('categoryProgressList');
  categoryProgressList.innerHTML = '';

  questionsData.categories.forEach((category) => {
    const questions = allQuestions.filter((question) => question.category === category.id);
    const catCompleted = questions.filter((question) => getQuestionProgress(question.id).correct).length;
    const catTotal = questions.length;
    const catPercentage = catTotal > 0 ? Math.round((catCompleted / catTotal) * 100) : 0;
    const lessonStats = getLessonStats(category.id);

    const item = document.createElement('div');
    item.className = 'category-progress-item';
    item.innerHTML = `
      <div class="progress-header">
        <h4>${category.name} <span>${catCompleted} / ${catTotal}</span></h4>
        <span class="lesson-progress">教程 ${lessonStats.completed} / ${lessonStats.total}</span>
      </div>
      <div class="progress-line">
        <div class="progress-line-fill" style="width: ${catPercentage}%"></div>
      </div>
    `;

    categoryProgressList.appendChild(item);
  });

  const recentList = document.getElementById('recentActivityList');
  recentList.innerHTML = '';

  const recentAttempts = Object.entries(userProgress)
    .filter(([, data]) => data.lastAttempt)
    .sort((a, b) => b[1].lastAttempt - a[1].lastAttempt)
    .slice(0, 10);

  if (recentAttempts.length === 0) {
    recentList.innerHTML = '<p class="progress-empty">暂无学习记录，快去开启第一道题吧！</p>';
  } else {
    recentAttempts.forEach(([questionId, data]) => {
      const question = allQuestions.find((item) => item.id === questionId);
      if (!question) return;

      const item = document.createElement('div');
      item.className = 'activity-item';
      const icon = data.correct ? '✅' : '❌';
      const timeAgo = getTimeAgo(data.lastAttempt);
      item.innerHTML = `
        <div class="activity-row">
          <span>${icon} ${question.question.substring(0, 60)}${question.question.length > 60 ? '...' : ''}</span>
          <span class="activity-time">${timeAgo}</span>
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
  const completed = questionsData.questions.filter((question) => getQuestionProgress(question.id).correct).length;
  const total = questionsData.questions.length;
  const percentage = Math.round((completed / total) * 100);
  const percentElement = document.getElementById('progressPercent');
  if (percentElement) {
    percentElement.textContent = `${percentage}%`;
  }
}

function resetProgress() {
  if (!confirm('确定要重置所有练习进度吗？此操作不可撤销。')) return;
  userProgress = {};
  saveQuestionProgress();
  alert('练习进度已重置');
  renderPractice();
  updateProgressDisplay();
}

function handleSearch(event) {
  const query = event.target.value.toLowerCase().trim();
  if (!questionsData || query.length < 2) return;

  const matchedQuestions = questionsData.questions.filter((question) =>
    question.question.toLowerCase().includes(query) ||
    question.options.some((option) => option.text.toLowerCase().includes(query))
  );

  const matchedLessons = tutorialsData?.tutorials.flatMap((module) =>
    module.lessons.filter((lesson) =>
      lesson.title.toLowerCase().includes(query) ||
      lesson.description.toLowerCase().includes(query)
    ).map((lesson) => ({
      module: module.categoryName,
      lesson
    }))
  ) || [];

  console.info(`搜索「${query}」共找到题目 ${matchedQuestions.length} 条，教程 ${matchedLessons.length} 条。`);
}

function closeModal() {
  document.getElementById('questionModal')?.classList.remove('show');
}

if (localStorage.getItem('theme') === 'dark') {
  document.body.classList.add('dark');
}

loadData();
