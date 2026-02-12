/* utils.js - 随机/辅助/名字生成函数 */

// ========== 可种子化的随机数生成器 ==========
// 基于 xorshift128+ 算法的简单伪随机数生成器
class SeededRandom {
  constructor(seed) {
    // 当 seed === -1 时，表示显式要求使用原生 Math.random()
    this.useNative = (seed === -1);
    // 如果未指定种子或为 null/undefined，则使用当前时间
    this.seed = (seed === undefined || seed === null) ? Date.now() : seed;
    // 对于非原生模式，使用种子初始化状态
    if (!this.useNative) {
      this.state0 = this.seed ^ 0x12345678;
      this.state1 = (this.seed * 0x9E3779B9) ^ 0x87654321;
    }
  }

  next() {
    // 如果构造时选择了原生随机，则直接返回 Math.random()
    if (this.useNative) return Math.random();

    let s1 = this.state0;
    let s0 = this.state1;
    this.state0 = s0;
    s1 ^= s1 << 23;
    s1 ^= s1 >> 17;
    s1 ^= s0;
    s1 ^= s0 >> 26;
    this.state1 = s1;
    const result = (this.state0 + this.state1) >>> 0;
    return result / 0x100000000;

  }
}

// 全局随机数生成器实例
let _globalRng = null;

// 设置全局种子
function setRandomSeed(seed) {
  if (seed !== null && seed !== undefined) {
    // 允许通过 -1 明确请求使用原生 Math.random()
    _globalRng = new SeededRandom(seed);
    if (seed === -1) {
      console.log('[Random] 已设置为使用原生 Math.random()（种子 -1）');
    } else {
      console.log(`[Random] 随机种子已设置: ${seed}`);
    }
  } else {
    _globalRng = null;
    console.log(`[Random] 使用默认随机数生成器`);
  }
}

// 获取随机数（0-1之间）
function getRandom() {
  if (_globalRng) {
    return _globalRng.next();
  }
  return Math.random();
}

function uniform(min, max){ return min + getRandom()*(max-min); }
function uniformInt(min, max){ return Math.floor(min + getRandom()*(max - min + 1)); }
function normal(mean=0, stddev=1){
  let u=0,v=0;
  while(u===0) u=getRandom();
  while(v===0) v=getRandom();
  let z=Math.sqrt(-2.0*Math.log(u))*Math.cos(2*Math.PI*v);
  return z*stddev + mean;
}
function clamp(val,min,max){ return Math.max(min,Math.min(max,val)); }
function clampInt(v,min,max){ return Math.max(min,Math.min(max,Math.round(v))); }
function sigmoid(x){ return 1.0 / (1.0 + Math.exp(-x)); }

/* 今日挑战：根据日期生成种子和挑战参数 */
function getDailyChallengeParams() {
  const today = new Date();
  const dateStr = `${today.getFullYear()}${String(today.getMonth() + 1).padStart(2, '0')}${String(today.getDate()).padStart(2, '0')}`;

  // 使用日期字符串作为种子生成随机数
  function seededRandom(seed) {
    const x = Math.sin(seed++) * 10000;
    return x - Math.floor(x);
  }

  const seed = parseInt(dateStr);

  // 使用种子生成省份（1-33之间）
  const provinceId = Math.floor(seededRandom(seed) * 33) + 1;

  // 使用种子生成初始随机种子（用于游戏内RNG）
  const gameSeed = Math.floor(seededRandom(seed + 1) * 1000000);

  return {
    date: dateStr,
    provinceId: provinceId,
    difficulty: 2, // 固定普通难度
    seed: gameSeed,
    displayDate: `${today.getFullYear()}年${today.getMonth() + 1}月${today.getDate()}日`
  };
}

function getLetterGradeAbility(val){
    return getLetterGrade(val / 2);
}

function getLetterGrade(val) {
  // 更细化的字母等级，包含带+的中间值。阈值略微上调以匹配数值显示
  // 等级（从低到高）： E, E+, D, D+, C, C+, B, B+, A, A+, S, S+, SS, SS+, SSS
  if (val < 7) return '一窍不通';
  if (val < 14) return '略知皮毛';
  if (val < 21) return '一知半解';
  if (val < 28) return '初窥门径';
  if (val < 35) return '粗通一二';
  if (val < 42) return '入门基础';
  if (val < 49) return '登堂入室';
  if (val < 56) return '得心应手';
  if (val < 63) return '驾轻就熟';
  if (val < 70) return '游刃有余';
  if (val < 77) return '融会贯通';
  if (val < 84) return '炉火纯青';
  if (val < 91) return '博大精深';
  if (val < 100) return '登峰造极';
  // 保持 100 为 SSS，且在 100 之后扩展为不封顶的 U 级别：U1e ... U1sss, U2e ...
  const n = Math.floor(val);
  if (n === 100) return '超凡入圣';
  if (n > 100) {
    const subs = ['1 级','2 级','3 级','4 级','5 级','6 级','7 级','8 级','9 级','10 级','11 级','12 级','13 级','14 级','15 级'];
    const v = Number(val);
    // 保留 101-109 的向后兼容整数步进映射（原有行为）
    if (v > 100 && v < 110) {
      const offset = n - 101; // 0-based offset after 100
      const tier = Math.floor(offset / subs.length) + 1;
      const idx = offset % subs.length;
      return `超凡入圣 ${tier} 段 ${subs[idx]}`;
    }
    // 从 110 起，每个 100 的区间对应 U1, U2, U3...，区间内按 subs 均匀映射
    if (v >= 110) {
      const tier = Math.floor((v - 110) / 100) + 1; // 110-209.999 -> tier 1, 210-309.999 -> tier 2
      const rangeStart = 110 + (tier - 1) * 100;
      const rel = (v - rangeStart) / 100.0; // [0,1)
      let idx = Math.floor(rel * subs.length);
      if (idx < 0) idx = 0;
      if (idx >= subs.length) idx = subs.length - 1;
      return `超凡入圣 ${tier} 段 ${subs[idx]}`;
    }
    // 兜底：保留原有按整数步进的映射
    const offset = n - 101;
    const tier = Math.floor(offset / subs.length) + 1;
    const idx = offset % subs.length;
    return `超凡入圣 ${tier} 段 ${subs[idx]}`;
  }
  return '超凡入圣';
}

/* 名字生成 - 简化版：从给定名字库随机选取 */

// 名字库（可直接修改这里，自由添加/删除名字）
const namePool = [
  "郑浩崎","史梓轩","肖玘含","杨子奚","裴语菲","陈彦汐","孙浩洋","刘书瑶","刘钰熙","廖天泽","刘元亨",
  "李如萱","江兆琨","张煊伊","刘梓轩","徐梓蓁","卢美辰","史桐宇","贾子渊","胡靖涵","王麒铭","贾孙晨溪"
  ,"张懿文","郭冯楚涵","王祎娃","张妙颐","王珥澈","吴昕玥","董子墨","付晴飞","蒙俊景","林子钰","刘禹希"
  ,"冯成灏宇","杨绍晖","米索拉","杨佳宜","马嘉懿","侯姝含","于泽鑫"
];

/**

 * 从名字库中随机选取一个名字
 * @returns {string} 随机选中的名字
   */
    function generateName() {
   const index = Math.floor(Math.random() * namePool.length);
   return namePool[index];
    }

/**

 * 生成不重复的名字
 * @param {Object} opts - 选项参数
 * @param {Array<string>} opts.existingNames - 已存在的名字列表
 * @param {number} opts.maxRetries - 最大重试次数，默认 100
 * @returns {string} 生成的不重复名字
   */
     function generateUniqueName(opts = {}) {
   const existingNames = opts.existingNames || [];
   const maxRetries = opts.maxRetries || 100;

  // 如果没有已存在的名字，直接生成
  if (!Array.isArray(existingNames) || existingNames.length === 0) {
    return generateName();
  }

  // 将已存在的名字转换为 Set 以提高查找效率
  const nameSet = new Set(existingNames);

  // 尝试生成不重复的名字
  for (let i = 0; i < maxRetries; i++) {
    const name = generateName();
    if (!nameSet.has(name)) {
      return name;
    }
  }

  // 如果重试多次仍然重复，添加数字后缀确保唯一性
  let baseName = generateName();
  let counter = 2;
  while (nameSet.has(baseName)) {
    baseName = generateName();
    if (counter > maxRetries) break; // 防止无限循环
    counter++;
  }

  // 如果还是重复，强制添加后缀
  if (nameSet.has(baseName)) {
    counter = 2;
    let uniqueName = `${baseName}${counter}`;
    while (nameSet.has(uniqueName)) {
      counter++;
      uniqueName = `${baseName}${counter}`;
    }
    return uniqueName;
  }

  return baseName;
}

// 极简版：如果只需要最简单的功能
// function getName() {
//   return namePool[Math.floor(Math.random() * namePool.length)];
// }