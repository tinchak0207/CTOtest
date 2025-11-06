const QuestionGenerator = (function() {
  const DEFAULT_MODULE = 'custom';
  
  // 关键词库 - 用于识别技术内容
  const TECH_KEYWORDS = [
    '机器人', '传感器', '控制', '算法', '编程', '系统', '设计', '开发',
    '技术', '方法', '原理', '结构', '功能', '性能', '优化', '测试',
    'robot', 'sensor', 'control', 'algorithm', 'programming', 'system'
  ];

  // 判断性词汇 - 用于生成判断题
  const ASSERTION_WORDS = ['是', '能', '可以', '会', '必须', '应该', '需要', '具有', '属于'];
  
  // 否定词汇 - 用于生成错误选项
  const NEGATION_WORDS = ['不', '无', '非', '错误', '不能', '不会', '不是', '没有'];

  /**
   * 主入口：从文本生成题目
   * @param {string} text - OCR识别的文本
   * @param {Object} options - 生成选项
   * @returns {Array} 生成的题目数组
   */
  function generateQuestions(text, options = {}) {
    const {
      module = DEFAULT_MODULE,
      count = 10,
      types = ['single', 'multiple', 'truefalse'],
      difficulty = 'medium'
    } = options;

    if (!text || text.trim().length < 50) {
      throw new Error('文本内容太少，无法生成题目（至少需要50个字符）');
    }

    const sentences = extractSentences(text);
    const keywords = extractKeywords(text);

    // 验证提取的句子和关键词
    if (!Array.isArray(sentences) || sentences.length === 0) {
      throw new Error('未能从文本中提取到有效的句子，请检查文档内容');
    }

    if (!Array.isArray(keywords) || keywords.length === 0) {
      throw new Error('未能从文本中提取到有效的关键词，请检查文档内容');
    }

    const questions = [];

    // 按类型分配题目数量
    const typeCounts = distributeQuestionTypes(count, types);

    // 生成单选题
    if (typeCounts.single > 0) {
      questions.push(...generateSingleChoice(sentences, keywords, typeCounts.single, module));
    }

    // 生成多选题
    if (typeCounts.multiple > 0) {
      questions.push(...generateMultipleChoice(sentences, keywords, typeCounts.multiple, module));
    }

    // 生成判断题
    if (typeCounts.truefalse > 0) {
      questions.push(...generateTrueFalse(sentences, typeCounts.truefalse, module));
    }

    // 如果生成的题目不够，补充生成
    if (questions.length < count) {
      const additional = generateAdditionalQuestions(sentences, keywords, count - questions.length, module);
      questions.push(...additional);
    }

    return questions.slice(0, count);
  }

  /**
   * 提取句子
   */
  function extractSentences(text) {
    // 清理文本
    const cleaned = text
      .replace(/\s+/g, ' ')
      .replace(/[^\u4e00-\u9fa5a-zA-Z0-9，。！？、；：""''（）\(\),.!?;:\-\s]/g, '');
    
    // 按标点符号分割句子
    const sentences = cleaned
      .split(/[。！？\n.!?]+/)
      .map(s => s.trim())
      .filter(s => s.length >= 10 && s.length <= 200)
      .filter(s => containsTechContent(s));

    // 确保返回数组，即使为空
    return Array.isArray(sentences) ? sentences : [];
  }

  /**
   * 提取关键词
   */
  function extractKeywords(text) {
    const words = new Set();
    
    // 提取技术关键词
    TECH_KEYWORDS.forEach(keyword => {
      if (text.includes(keyword)) {
        words.add(keyword);
      }
    });

    // 提取中文词组（2-4个字）
    const chinesePattern = /[\u4e00-\u9fa5]{2,4}/g;
    const matches = text.match(chinesePattern) || [];
    matches.forEach(word => {
      if (word.length >= 2 && word.length <= 4) {
        words.add(word);
      }
    });

    // 提取英文单词
    const englishPattern = /[a-zA-Z]{3,}/g;
    const englishMatches = text.match(englishPattern) || [];
    englishMatches.forEach(word => {
      if (word.length >= 3) {
        words.add(word.toLowerCase());
      }
    });

    return Array.from(words).slice(0, 50);
  }

  /**
   * 判断是否包含技术内容
   */
  function containsTechContent(sentence) {
    return TECH_KEYWORDS.some(keyword => sentence.includes(keyword)) ||
           /[\u4e00-\u9fa5]{4,}/.test(sentence);
  }

  /**
   * 分配题目类型数量
   */
  function distributeQuestionTypes(total, types) {
    const counts = { single: 0, multiple: 0, truefalse: 0 };
    
    if (types.length === 0) return counts;
    
    const baseCount = Math.floor(total / types.length);
    const remainder = total % types.length;
    
    types.forEach((type, index) => {
      counts[type] = baseCount + (index < remainder ? 1 : 0);
    });
    
    return counts;
  }

  /**
   * 生成单选题
   */
  function generateSingleChoice(sentences, keywords, count, module) {
    const questions = [];
    const usedSentences = new Set();

    for (let i = 0; i < Math.min(count, sentences.length); i++) {
      let sentence = selectRandomUnused(sentences, usedSentences);
      if (!sentence) break;

      const keyword = findKeywordInSentence(sentence, keywords);
      if (!keyword) continue;

      const questionText = createQuestionFromSentence(sentence, keyword);
      const correctAnswer = keyword;
      const distractors = generateDistractors(keyword, keywords, 3);

      const options = shuffleArray([correctAnswer, ...distractors]);
      const answerIndex = options.indexOf(correctAnswer);

      questions.push({
        id: generateQuestionId(),
        text: questionText,
        options: options,
        answer: answerIndex,
        type: 'single',
        module: module,
        source: 'generated',
        createdAt: Date.now()
      });
    }

    return questions;
  }

  /**
   * 生成多选题
   */
  function generateMultipleChoice(sentences, keywords, count, module) {
    const questions = [];
    const usedSentences = new Set();

    for (let i = 0; i < Math.min(count, Math.floor(sentences.length / 2)); i++) {
      let sentence = selectRandomUnused(sentences, usedSentences);
      if (!sentence) break;

      const relatedKeywords = keywords.filter(kw => sentence.includes(kw)).slice(0, 4);
      if (relatedKeywords.length < 2) continue;

      const questionText = `以下哪些选项与"${(sentence || '').slice(0, 30)}..."相关？（多选）`;
      const correctAnswers = relatedKeywords.slice(0, 2 + Math.floor(Math.random() * 2));
      const distractors = generateDistractors(correctAnswers[0], keywords, 4 - correctAnswers.length);
      
      const options = shuffleArray([...correctAnswers, ...distractors]);
      const answerIndices = correctAnswers.map(ans => options.indexOf(ans)).sort((a, b) => a - b);

      questions.push({
        id: generateQuestionId(),
        text: questionText,
        options: options,
        answer: answerIndices,
        type: 'multiple',
        module: module,
        source: 'generated',
        createdAt: Date.now()
      });
    }

    return questions;
  }

  /**
   * 生成判断题
   */
  function generateTrueFalse(sentences, count, module) {
    const questions = [];
    const usedSentences = new Set();

    for (let i = 0; i < Math.min(count, sentences.length); i++) {
      let sentence = selectRandomUnused(sentences, usedSentences);
      if (!sentence) break;

      // 随机决定是正确还是错误的陈述
      const isCorrect = Math.random() > 0.5;
      let questionText = sentence;

      if (!isCorrect) {
        // 创建错误的陈述
        questionText = createFalseStatement(sentence);
      }

      // 确保问号结尾
      if (!questionText.endsWith('？') && !questionText.endsWith('?')) {
        questionText = questionText.replace(/[。.]+$/, '') + '。';
      }

      questions.push({
        id: generateQuestionId(),
        text: questionText,
        options: ['正确', '错误'],
        answer: isCorrect ? 0 : 1,
        type: 'truefalse',
        module: module,
        source: 'generated',
        createdAt: Date.now()
      });
    }

    return questions;
  }

  /**
   * 生成额外题目（当题目不够时）
   */
  function generateAdditionalQuestions(sentences, keywords, count, module) {
    const questions = [];
    
    for (let i = 0; i < count; i++) {
      const sentence = sentences[Math.floor(Math.random() * sentences.length)] || '';
      const keyword = keywords[Math.floor(Math.random() * keywords.length)] || '';
      
      const type = ['single', 'truefalse'][Math.floor(Math.random() * 2)];
      
      if (type === 'single') {
        const questionText = `关于"${keyword}"，以下描述正确的是：`;
        const distractors = generateDistractors(keyword, keywords, 3);
        const options = shuffleArray([sentence.slice(0, 40), ...distractors.map(d => `与${d}相关的内容`)]);
        
        questions.push({
          id: generateQuestionId(),
          text: questionText,
          options: options,
          answer: 0,
          type: 'single',
          module: module,
          source: 'generated',
          createdAt: Date.now()
        });
      } else {
        questions.push({
          id: generateQuestionId(),
          text: sentence,
          options: ['正确', '错误'],
          answer: 0,
          type: 'truefalse',
          module: module,
          source: 'generated',
          createdAt: Date.now()
        });
      }
    }
    
    return questions;
  }

  /**
   * 从句子中创建问题
   */
  function createQuestionFromSentence(sentence, keyword) {
    const templates = [
      `以下关于"${keyword}"的描述，正确的是：`,
      `关于${keyword}，下列说法正确的是：`,
      `${keyword}的特点是：`,
      `以下哪项关于"${keyword}"的说法是正确的？`
    ];
    
    return templates[Math.floor(Math.random() * templates.length)];
  }

  /**
   * 创建错误陈述
   */
  function createFalseStatement(sentence) {
    // 尝试插入否定词
    if (ASSERTION_WORDS.some(word => sentence.includes(word))) {
      for (const word of ASSERTION_WORDS) {
        if (sentence.includes(word)) {
          const negation = NEGATION_WORDS[Math.floor(Math.random() * NEGATION_WORDS.length)];
          return sentence.replace(word, negation + word);
        }
      }
    }
    
    // 如果无法修改，添加否定前缀
    return '不' + sentence;
  }

  /**
   * 在句子中查找关键词
   */
  function findKeywordInSentence(sentence, keywords) {
    const found = keywords.filter(kw => sentence.includes(kw));
    return found.length > 0 ? found[Math.floor(Math.random() * found.length)] : null;
  }

  /**
   * 生成干扰项
   */
  function generateDistractors(correctAnswer, keywords, count) {
    const distractors = keywords
      .filter(kw => kw !== correctAnswer)
      .sort(() => Math.random() - 0.5)
      .slice(0, count);
    
    // 如果关键词不够，生成通用干扰项
    while (distractors.length < count) {
      distractors.push(`选项${String.fromCharCode(65 + distractors.length)}`);
    }
    
    return distractors;
  }

  /**
   * 选择未使用的随机句子
   */
  function selectRandomUnused(array, usedSet) {
    if (!Array.isArray(array) || array.length === 0) {
      return null;
    }
    
    const available = array.filter((item, index) => !usedSet.has(index) && item);
    if (available.length === 0) return null;
    
    const selected = available[Math.floor(Math.random() * available.length)];
    const index = array.indexOf(selected);
    if (index >= 0) {
      usedSet.add(index);
    }
    
    return selected || null;
  }

  /**
   * 洗牌算法
   */
  function shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  /**
   * 生成题目ID
   */
  function generateQuestionId() {
    return 'gen_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  // 公共API
  return {
    generateQuestions,
    
    // 辅助方法
    extractSentences,
    extractKeywords
  };
})();

// 导出供外部使用
if (typeof module !== 'undefined' && module.exports) {
  module.exports = QuestionGenerator;
}
