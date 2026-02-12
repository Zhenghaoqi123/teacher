/* task.js - 题目库系统 */
// 依赖：utils.js

/* 题目定义

 * 每道题目包含：
 * - name: 题目名称
 * - difficulty: 难度值（0-100）
 * - boosts: 知识点提升数组，每项包含 {type: '知识点类型', amount: 增幅值}
 * 最多3个知识点，类型可选：'数据结构', '图论', '字符串', '数学', 'DP'
   */

const TASK_POOL = [
  { name: '2025北京中考真题语文', difficulty: 50, boosts: [{ type: '语文', amount: 10 }, { type: '道法', amount: 1 }] },
  { name: '2025北京中考真题数学', difficulty: 70, boosts: [{ type: '数学', amount: 13 }, { type: '物理', amount: 3 }] },
  { name: '2025北京中考真题英语', difficulty: 30, boosts: [{ type: '英语', amount: 12 }, { type: '语文', amount: 1 }] },
  { name: '2025北京中考真题物理', difficulty: 40, boosts: [{ type: '物理', amount: 9 }, { type: '数学', amount: 6 }] },
  { name: '2025北京中考真题道法', difficulty: 30, boosts: [{ type: '道法', amount: 11 }, { type: '语文', amount: 2 }] },
  { name: '2025中学生数理化生综合实践活动', difficulty: 110, boosts: [{ type: '数学', amount: 30 }, { type: '物理', amount: 22 }] },
  { name: '2025青少年数学奥林匹克联赛', difficulty: 150, boosts: [{ type: '数学', amount: 50 }] },
  { name: '2025青少年物理奥林匹克联赛', difficulty: 150, boosts: [{ type: '物理', amount: 44 }, { type: '数学', amount: 18 }] },
  { name: '初中生辩论赛', difficulty: 40, boosts: [{ type: '语文', amount: 10 }, { type: '道法', amount: 6 }] },
  { name: '朝阳区艺术节', difficulty: 10, boosts: [{ type: '语文', amount: 1 }] },
  { name: '“双奥朝阳”朝阳区中小学生田径运动会', difficulty: 30, boosts: [{ type: '道法', amount: 1 }, ] },
  { name: '全国书法大赛', difficulty: 20, boosts: [{ type: '语文', amount: 8 }] },
  { name: 'CSP-J（CCF非专业级软件能力认证入门级）', difficulty: 70, boosts: [{ type: '数学', amount: 8 }] },
  { name: 'CSP-S（CCF非专业级软件能力认证提高级）', difficulty: 140, boosts: [{ type: '数学', amount: 18 }] },
  { name: 'NOIP2025（全国青少年信息学奥林匹克联赛）', difficulty: 150, boosts: [{ type: '数学', amount: 22 }] },
  { name: '2024北京中考真题语文', difficulty: 50, boosts: [{ type: '语文', amount: 8 }, { type: '道法', amount: 1 }] },
  { name: '2024北京中考真题数学', difficulty: 70, boosts: [{ type: '数学', amount: 15 }, { type: '物理', amount: 3 }] },
  { name: '2024北京中考真题英语', difficulty: 30, boosts: [{ type: '英语', amount: 11 }, { type: '语文', amount: 1 }] },
  { name: '2024北京中考真题物理', difficulty: 40, boosts: [{ type: '物理', amount: 10 }, { type: '数学', amount: 6 }] },
  { name: '2024北京中考真题道法（注：闭卷）', difficulty: 60, boosts: [{ type: '道法', amount: 18 }, { type: '语文', amount: 4 }] },
  { name: 'NOIP2024（全国青少年信息学奥林匹克联赛）', difficulty: 130, boosts: [{ type: '数学', amount: 12 }] },
  { name: '2026北京市朝阳区八年级第一学期语文期末考试', difficulty: 30, boosts: [{ type: '语文', amount: 9 }, ] },
  { name: '2026北京市朝阳区八年级第一学期数学期末考试', difficulty: 30, boosts: [{ type: '数学', amount: 11 }, ] },
  { name: '2026北京市朝阳区八年级第一学期英语期末考试', difficulty: 20, boosts: [{ type: '英语', amount: 7 }, { type: '道法', amount: 3 }] },
  { name: '2026北京市朝阳区八年级第一学期道法期末考试', difficulty: 10, boosts: [{ type: '道法', amount: 3 }] },
  { name: '2026北京市朝阳区八年级第一学期物理期末考试', difficulty: 30, boosts: [{ type: '物理', amount: 8 }, { type: '语文', amount: 4 }] },
  { name: '2026北京市朝阳区七年级第二学期语文期末考试', difficulty: 40, boosts: [{ type: '语文', amount: 12 }, ] },
  { name: '2026北京市朝阳区七年级第二学期数学期末考试', difficulty: 10, boosts: [{ type: '数学', amount: 3 }, ] },
  { name: '2026北京市朝阳区七年级第二学期英语期末考试', difficulty: 10, boosts: [{ type: '英语', amount: 5 }] },
  { name: '2026北京市朝阳区七年级第二学期道法期末考试', difficulty: 30, boosts: [{ type: '道法', amount: 7 }, { type: '语文', amount: 4 }] },
  { name: '未来女性培养计划', difficulty: 80, boosts: [{ type: '语文', amount: 7 }, { type: '物理', amount: 18 },{ type: '英语', amount: 2 }] },
  { name: '中国共青团团校课', difficulty: 60, boosts: [{ type: '语文', amount: 7 }, { type: '道法', amount: 25 }] },
  { name: '语文高中课本必修上册', difficulty: 100, boosts: [{ type: '语文', amount: 36 }] },
  { name: '语文高中课本必修中册', difficulty: 110, boosts: [{ type: '语文', amount: 37 }] },
  { name: '语文高中课本必修下册', difficulty: 120, boosts: [{ type: '语文', amount: 39 }] },
  { name: '数学小蓝本', difficulty: 130, boosts: [{ type: '数学', amount: 31 }] },
  { name: 'KET', difficulty: 20, boosts: [{ type: '英语', amount: 4 }] },
  { name: 'PET', difficulty: 100, boosts: [{ type: '英语', amount: 30 }] },
  { name: 'FCE', difficulty: 130, boosts: [{ type: '英语', amount: 33 }] },
  { name: '托福英语', difficulty: 130, boosts: [{ type: '英语', amount: 37 }] },
  { name: '雅思英语', difficulty: 130, boosts: [{ type: '英语', amount: 38 }] },
  { name: 'FXJ“虚假的学习”——熏陶情怀的讲座', difficulty: 10, boosts: [{ type: '语文', amount: 1 }, { type: '道法', amount: 1 },{ type: '英语', amount: 1 }] },
  { name: 'FXJ“虚假的学习”——科技前沿的讲座', difficulty: 10, boosts: [{ type: '数学', amount: 1 }, { type: '物理', amount: 1 }] },
  { name: 'FXJ“虚假的学习”——社团实践的晚自习I', difficulty: 10, boosts: [{ type: '语文', amount: -20 }, { type: '道法', amount: -20 },{ type: '英语', amount: -20 }] },
  { name: 'FXJ“虚假的学习”——社团实践的晚自习II', difficulty: 10, boosts: [{ type: '数学', amount: -20 }, { type: '物理', amount: -20 },] },
  { name: '初中文言文助读', difficulty: 80, boosts: [{ type: '语文', amount: 18 }, { type: '道法', amount: 5 }] },
  { name: '每日一篇随笔', difficulty: 30, boosts: [{ type: '语文', amount: 13 }] },
  { name: '中国历史八年级下册期末练习', difficulty: 10, boosts: [{ type: '语文', amount: 3 }, { type: '道法', amount: 8 }] },
  { name: '初中文言文助读', difficulty: 80, boosts: [{ type: '语文', amount: 18 }, { type: '道法', amount: 5 }] },
  { name: '班级足球联赛', difficulty: 10, boosts: [{ type: '道法', amount: 1 }] },
  { name: '班级篮球联赛', difficulty: 10, boosts: [{ type: '数学', amount: 1 }] },
  { name: '羽毛球联赛', difficulty: 10, boosts: [{ type: '物理', amount: 1 }] },
  { name: '综合实践：探究一年的影子长短变化', difficulty: 30, boosts: [{ type: '数学', amount: 6 },{ type: '物理', amount: 7 }] },
  { name: '综合实践：二进制的计算', difficulty: 30, boosts: [{ type: '数学', amount: 9 }] },
  { name: '2023北京中考真题语文', difficulty: 50, boosts: [{ type: '语文', amount: 9 }, { type: '英语', amount: 1 }] },
  { name: '2023北京中考真题数学', difficulty: 70, boosts: [{ type: '数学', amount: 14 }, { type: '物理', amount: 1 }] },
  { name: '2023北京中考真题英语', difficulty: 30, boosts: [{ type: '英语', amount: 10 }, { type: '道法', amount: 1 }] },
  { name: '2023北京中考真题物理', difficulty: 40, boosts: [{ type: '物理', amount: 10 }, { type: '数学', amount: 2 }] },
  { name: '2023北京中考真题道法（注：闭卷）', difficulty: 60, boosts: [{ type: '道法', amount: 12 }, { type: '语文', amount: 5 }] }
];

/**

 * 从题目池中随机抽取n道题目
 * @param {number} count - 要抽取的题目数量（默认7道：5道推荐+2道随机）
 * @returns {Array} 抽取的题目数组
   */
   function selectRandomTasks(count = 7) {
     // 记录最近推荐过的题目（使用全局变量，避免短时间内重复推荐）
     if (typeof window !== 'undefined') {
   if (!window._recentRecommendedTasks) {
     window._recentRecommendedTasks = [];
   }
   if (!window._recentRandomTasks) {
     window._recentRandomTasks = [];
   }
     }

  if (count >= TASK_POOL.length) {
    // 如果要抽取的数量大于等于题目池大小，返回打乱的全部题目
    return shuffleArray([...TASK_POOL]).slice(0, count);
  }

  // 新的选题逻辑：5道推荐题（吸收率>70%且难度越高越好）+ 2道随机题
  // 1) 计算当前学生的平均能力（思维 + 编码 平均）
  // 2) 筛选出吸收率>70%的题目，按难度降序排列
  // 3) 从高难度题目中选取5道推荐题（避免重复推荐）
  // 4) 随机选取2道题目（避免与推荐题重复）

  // 计算学生平均能力（尝试从全局 game 中获取活跃学生）
  let avgAbility = 50; // 兜底值
  try {
    if (typeof window !== 'undefined' && window.game && Array.isArray(window.game.students) && window.game.students.length > 0) {
      const actives = window.game.students.filter(s => s && s.active !== false);
      if (actives.length > 0) {
        const sum = actives.reduce((acc, s) => {
          const th = Number(s.thinking || 0);
          const co = Number(s.coding || 0);
          return acc + (th + co) / 2.0;
        }, 0);
        avgAbility = sum / actives.length;
      }
    }
  } catch (e) {
    // ignore and use default
  }

  // 应用全局题目难度增幅
  const difficultyMult = (typeof DIFFICULTY_MULTIPLIER !== 'undefined' ? DIFFICULTY_MULTIPLIER : 1.0);

  // 计算所有题目的吸收率和有效难度
  const tasksWithScore = TASK_POOL.map(task => {
    const effectiveDifficulty = task.difficulty * difficultyMult;
    const absorptionRate = calculateBoostMultiplier(avgAbility, effectiveDifficulty);
    return {
      task: task,
      absorptionRate: absorptionRate,
      effectiveDifficulty: effectiveDifficulty
    };
  });

  // 获取最近推荐过的题目名称
  const recentRecommended = (typeof window !== 'undefined' && window._recentRecommendedTasks) ? window._recentRecommendedTasks : [];
  const recentRandom = (typeof window !== 'undefined' && window._recentRandomTasks) ? window._recentRandomTasks : [];

  // 第一步：选择5道推荐题（吸收率>70%且难度越高越好）
  const recommendedCount = Math.min(5, count);
  const candidatesForRecommended = tasksWithScore
    .filter(item => item.absorptionRate >= 0.7) // 吸收率>70%
    .filter(item => !recentRecommended.includes(item.task.name)) // 排除最近推荐过的
    .sort((a, b) => b.effectiveDifficulty - a.effectiveDifficulty); // 按难度降序排列

  const recommended = [];

  // 如果候选题目不足，放宽条件（不考虑最近推荐）
  if (candidatesForRecommended.length < recommendedCount) {
    const fallbackCandidates = tasksWithScore
      .filter(item => item.absorptionRate >= 0.7)
      .sort((a, b) => b.effectiveDifficulty - a.effectiveDifficulty);
    

    for (let i = 0; i < Math.min(recommendedCount, fallbackCandidates.length); i++) {
      recommended.push(fallbackCandidates[i].task);
    }

  } else {
    // 从候选中随机选取推荐数量（增加多样性）
    const shuffledCandidates = shuffleArray(candidatesForRecommended.slice(0, Math.min(15, candidatesForRecommended.length)));
    for (let i = 0; i < Math.min(recommendedCount, shuffledCandidates.length); i++) {
      recommended.push(shuffledCandidates[i].task);
    }
  }

  // 第二步：选择2道随机题（不与推荐题重复）
  const randomCount = count - recommended.length;
  const recommendedNames = new Set(recommended.map(t => t.name));

  const candidatesForRandom = TASK_POOL
    .filter(task => !recommendedNames.has(task.name)) // 排除推荐题
    .filter(task => !recentRandom.includes(task.name)); // 排除最近随机过的

  const shuffledRandom = shuffleArray(candidatesForRandom);
  const randomTasks = [];

  for (let i = 0; i < Math.min(randomCount, shuffledRandom.length); i++) {
    randomTasks.push(shuffledRandom[i]);
  }

  // 如果随机题不足，从所有剩余题目中补充
  if (randomTasks.length < randomCount) {
    const allRemaining = TASK_POOL.filter(task => !recommendedNames.has(task.name));
    const shuffledRemaining = shuffleArray(allRemaining);
    

    for (let i = 0; i < shuffledRemaining.length && randomTasks.length < randomCount; i++) {
      const task = shuffledRemaining[i];
      if (!randomTasks.some(t => t.name === task.name)) {
        randomTasks.push(task);
      }
    }

  }

  // 合并推荐题和随机题
  const final = [...recommended, ...randomTasks];

  // 更新最近推荐/随机的题目记录（保留最近20道）
  if (typeof window !== 'undefined') {
    const recommendedNames = recommended.map(t => t.name);
    const randomNames = randomTasks.map(t => t.name);
    

    window._recentRecommendedTasks = [...recommendedNames, ...window._recentRecommendedTasks].slice(0, 20);
    window._recentRandomTasks = [...randomNames, ...window._recentRandomTasks].slice(0, 20);

  }

  return final;
}

/**

 * 洗牌函数 - Fisher-Yates算法
 * @param {Array} array - 要打乱的数组
 * @returns {Array} 打乱后的数组
   */
   function shuffleArray(array) {
     // 创建副本以避免修改原数组
     const arr = [...array];
     for (let i = arr.length - 1; i > 0; i--) {
   // 修复：uniformInt(min, max) 会返回 [min, max] 范围的整数
   // 我们需要 [0, i] 范围，所以应该是 uniformInt(0, i)
   const j = Math.floor(getRandom() * (i + 1));
   [arr[i], arr[j]] = [arr[j], arr[i]];
     }
     return arr;
   }

/**

 * 计算做题增幅的二次函数
 * 当学生能力（思维和编码平均）等于难度时，增幅 = 1.0（即100%）
 * 能力过高或过低时，增幅都会降低
 * 
 * 使用二次函数: multiplier = 1 - k * (ability - difficulty)^2
 * 当 ability = difficulty 时，multiplier = 1
 * 
 * @param {number} studentAbility - 学生能力（思维和编码平均值）
 * @param {number} taskDifficulty - 题目难度
 * @returns {number} 增幅倍数（0-1之间）
   */
   function calculateBoostMultiplier(studentAbility, taskDifficulty) {
     // 应用全局题目难度增幅
     const difficultyMult = (typeof DIFFICULTY_MULTIPLIER !== 'undefined' ? DIFFICULTY_MULTIPLIER : 1.0);
     const effectiveDifficulty = taskDifficulty * difficultyMult;

  const diff = studentAbility - effectiveDifficulty;

  // 使用分段函数来计算效率倍数：
  // 1. 能力低于难度：效率随能力/难度比例线性增长，但有最低保障
  // 2. 能力接近难度：效率最高（100%）
  // 3. 能力远高于难度：效率缓慢下降，但保持较高水平（不低于50%）

  let multiplier;

  if (diff >= -10) {
    // 能力接近或超过难度（在 ±10 范围内），效率接近 100%
    multiplier = 1.0;
  } else if (diff < -10 && diff >= -50) {
    // 能力略低于难度（10-50差距），效率线性下降：100% -> 60%
    // 线性插值：当 diff = -10 时为 1.0，diff = -50 时为 0.6
    multiplier = 1.0 + (diff + 10) * (0.4 / 40);
  } else if (diff < -50 && diff >= -100) {
    // 能力明显低于难度（50-100差距），效率继续下降：60% -> 30%
    multiplier = 0.6 + (diff + 50) * (0.3 / 50);
  } else {
    // 能力远低于难度（100+差距），效率最低：10% - 30%
    // 使用渐近线，最低 10%
    const excess = Math.abs(diff + 100);
    multiplier = 0.3 - 0.2 * Math.min(1.0, excess / 100);
  }

  // 确保倍数在合理范围内
  multiplier = clamp(multiplier, 0.1, 1.0);

  return multiplier;
}

/**

 * 应用题目对学生知识点的提升
 * @param {Student} student - 学生对象
 * @param {Object} task - 题目对象
 * @returns {Object} 包含实际提升值的对象
   */
   function applyTaskBoosts(student, task) {
     const studentAbility = (student.thinking + student.coding) / 2.0;
     const multiplier = calculateBoostMultiplier(studentAbility, task.difficulty);

  const results = {
    multiplier: multiplier,
    boosts: []
  };

  // 计算每个知识点的提升（不直接应用，由调用者处理）
  for (const boost of task.boosts) {
    const actualBoost = Math.floor(boost.amount * multiplier);
    

    // 注意：这里使用的类型名要与 Student 类中的知识点对应
    let typeName = boost.type;
    
    // 不在这里增加知识点，只返回计算结果
    // student.addKnowledge(typeName, actualBoost);
    
    results.boosts.push({
      type: typeName,
      baseAmount: boost.amount,
      actualAmount: actualBoost
    });

  }

  return results;
}

/**

 * 清理旧的题目缓存（一次性清理）
 * 由于我们移除了缓存机制，需要清理旧的缓存数据
   */
   function clearOldTaskCache() {
     try {
   if (typeof window !== 'undefined' && window.localStorage) {
     // 清理所有 weekly_tasks 开头的缓存
     const keys = Object.keys(window.localStorage);
     keys.forEach(key => {
       if (key.startsWith('weekly_tasks::')) {
         window.localStorage.removeItem(key);
       }
     });
   }
     } catch (e) {
   // ignore storage errors
     }
   }

// 页面加载时清理旧缓存（仅执行一次）
if (typeof window !== 'undefined') {
  clearOldTaskCache();
}
