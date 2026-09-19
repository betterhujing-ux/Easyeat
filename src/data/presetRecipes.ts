import { Recipe } from '../types';

export const PRESET_RECIPES: Recipe[] = [
  {
    id: 'preset-1',
    title: '经典黑椒香煎鸡胸肉',
    summary: '掌握控温与静置秘诀，无需复杂的腌料也能做到外焦里嫩、多汁不柴的高蛋白减脂基底。',
    category: '高蛋白',
    prepMinutes: 18,
    difficulty: '简单',
    servings: 1,
    createdAt: '2025-01-01',
    ingredients: [
      { name: '鸡胸肉 (去皮)', amount: 200, unit: 'g', cal: 266, protein: 49.2, fat: 3.8, carbs: 5.0 },
      { name: '特级初榨橄榄油', amount: 5, unit: 'g', cal: 45, protein: 0, fat: 5.0, carbs: 0 },
      { name: '黑胡椒碎与海盐', amount: 3, unit: 'g', cal: 5, protein: 0.1, fat: 0.1, carbs: 1.0 },
      { name: '生抽与少许料酒', amount: 10, unit: 'ml', cal: 8, protein: 0.8, fat: 0, carbs: 1.2 }
    ],
    steps: [
      '选一块厚度均匀的新鲜鸡胸肉，横刀切成两片厚度约 1.5 厘米的肉排，用刀背在表面轻轻敲打断筋。',
      '肉排表面加入 10ml 生抽、少许料酒、现磨黑胡椒碎与 1g 海盐，均匀涂抹按摩，腌制 10-15 分钟入味。',
      '平底锅预热至滴水成珠，刷入 5g 橄榄油，放入鸡胸肉排。保持中大火，一面煎 2.5 分钟至金黄焦脆。',
      '翻面继续煎 2 分钟，盖上锅盖转小火焖 1 分钟，关火后不要立刻切，放在温盘中静置 3 分钟锁住肉汁即可切条享用。'
    ],
    tips: '“出锅后静置 3 分钟”是鸡肉软嫩多汁的核心法宝，纤维自然回吸肉汁，切开绝不干柴。',
    totalCal: 324,
    totalProtein: 50.1,
    totalFat: 8.9,
    totalCarbs: 7.2
  },
  {
    id: 'preset-2',
    title: '少油彩椒牛肉粒',
    summary: '红黄彩椒富含维生素C，搭配细嫩牛里脊，色彩明艳爽口，饱腹感持久的高清爽正餐。',
    category: '低脂正餐',
    prepMinutes: 15,
    difficulty: '简单',
    servings: 1,
    createdAt: '2025-01-02',
    ingredients: [
      { name: '牛里脊', amount: 180, unit: 'g', cal: 193, protein: 40.0, fat: 1.6, carbs: 0.4 },
      { name: '彩椒 (红黄甜椒)', amount: 120, unit: 'g', cal: 31, protein: 1.2, fat: 0.2, carbs: 6.4 },
      { name: '特级初榨橄榄油', amount: 5, unit: 'g', cal: 45, protein: 0, fat: 5.0, carbs: 0 },
      { name: '生抽、黑胡椒、蒜末', amount: 10, unit: 'g', cal: 12, protein: 0.8, fat: 0.1, carbs: 1.8 }
    ],
    steps: [
      '牛里脊洗净吸干水分，逆着肉纹切成 1.5cm 见方的牛肉粒；彩椒洗净切同样大小方块备用。',
      '牛肉粒中加入少许生抽、现磨黑胡椒碎和半勺淀粉抓匀腌制 10 分钟。',
      '热锅倒入 5g 橄榄油下入蒜末爆香，大火滑入牛肉粒，快速翻炒 1 分钟至表面变色断生。',
      '迅速倒入彩椒块，继续大火翻炒 40 秒，出锅前撒入少许黑胡椒粉和海盐翻匀关火装盘。'
    ],
    tips: '牛肉必须大火快炒，彩椒断生即出锅，保持清脆口感与天然甜味。',
    totalCal: 281,
    totalProtein: 42.0,
    totalFat: 6.9,
    totalCarbs: 8.6
  },
  {
    id: 'preset-3',
    title: '番茄巴沙鱼暖胃浓汤',
    summary: '天然番茄起沙浓郁酸甜，巴沙鱼肉嫩滑细腻无刺，低脂高蛋白，暖身又开胃。',
    category: '低卡暖汤',
    prepMinutes: 20,
    difficulty: '简单',
    servings: 1,
    createdAt: '2025-01-03',
    ingredients: [
      { name: '巴沙鱼/龙利鱼柳', amount: 200, unit: 'g', cal: 176, protein: 30.0, fat: 5.0, carbs: 1.0 },
      { name: '生番茄/西红柿', amount: 250, unit: 'g', cal: 45, protein: 2.3, fat: 0.5, carbs: 8.3 },
      { name: '鲜金针菇或菌菇', amount: 80, unit: 'g', cal: 26, protein: 2.0, fat: 0.3, carbs: 4.8 },
      { name: '橄榄油', amount: 3, unit: 'g', cal: 27, protein: 0, fat: 3.0, carbs: 0 }
    ],
    steps: [
      '巴沙鱼解冻吸干水分切厚片，加入少许姜丝、白胡椒粉、料酒抓拌腌制 10 分钟。',
      '番茄顶部划十字，开水烫后撕去外皮，切成小碎丁。',
      '小汤锅倒入 3g 橄榄油，倒入番茄丁，中小火慢慢煸炒 3 分钟，直至番茄软烂出红油浓汁。',
      '加入一碗清水大火煮沸，下入金针菇小火慢炖 3 分钟，最后将腌好的鱼片一片片滑入汤中。',
      '鱼片入汤后不要用力搅动，中火煮约 1.5 分钟变白熟透，出锅前调入少许盐与葱花即可。'
    ],
    tips: '番茄切小碎丁并用小火慢炒是汤底浓郁起沙的秘诀，无需添加任何番茄酱。',
    totalCal: 274,
    totalProtein: 34.3,
    totalFat: 8.8,
    totalCarbs: 14.1
  },
  {
    id: 'preset-4',
    title: '鲜虾牛油果温沙拉',
    summary: '白灼鲜虾仁的弹牙鲜甜，搭配牛油果醇厚的不饱和脂肪酸与清甜果蔬，营养密度极佳。',
    category: '轻食沙拉',
    prepMinutes: 12,
    difficulty: '简单',
    servings: 1,
    createdAt: '2025-01-04',
    ingredients: [
      { name: '鲜虾仁', amount: 150, unit: 'g', cal: 72, protein: 15.6, fat: 1.1, carbs: 0 },
      { name: '牛油果', amount: 70, unit: 'g', cal: 112, protein: 1.4, fat: 10.3, carbs: 6.0 },
      { name: '球生菜/罗马生菜', amount: 100, unit: 'g', cal: 15, protein: 1.3, fat: 0.4, carbs: 2.2 },
      { name: '鸡蛋 (水煮)', amount: 50, unit: 'g', cal: 74, protein: 6.4, fat: 5.0, carbs: 0.8 },
      { name: '原味低盐油醋汁/柠檬汁', amount: 10, unit: 'ml', cal: 15, protein: 0.2, fat: 0.5, carbs: 2.5 }
    ],
    steps: [
      '锅内烧开水，加入一片生姜，放入鲜虾仁焯水 1.5 分钟至卷曲变红，捞出过冰水保持脆弹。',
      '鸡蛋冷水下锅煮 9 分钟，剥壳切成四瓣；生菜洗净甩干水分撕成一口大小垫在盘底。',
      '牛油果对半切开去核，果肉切成均匀片状或块状。',
      '将熟虾仁、牛油果和水煮蛋铺在生菜底上，淋入鲜榨柠檬汁与少许油醋汁，撒上少许粗研磨黑胡椒碎。'
    ],
    tips: '鲜虾仁焯水后立即过凉水或冰水，虾肉质感会极其紧实弹爽。',
    totalCal: 288,
    totalProtein: 24.9,
    totalFat: 17.3,
    totalCarbs: 11.5
  },
  {
    id: 'preset-5',
    title: '海鲜嫩豆腐暖胃汤',
    summary: '以鲜虾与内酯嫩豆腐为主角，汤色纯净清亮，鲜甜回甘，深夜加餐亦安心。',
    category: '低卡暖汤',
    prepMinutes: 15,
    difficulty: '简单',
    servings: 1,
    createdAt: '2025-01-05',
    ingredients: [
      { name: '嫩豆腐 (内酯豆腐)', amount: 200, unit: 'g', cal: 114, protein: 10.0, fat: 5.0, carbs: 6.0 },
      { name: '鲜虾仁', amount: 100, unit: 'g', cal: 48, protein: 10.4, fat: 0.7, carbs: 0 },
      { name: '鲜香菇', amount: 50, unit: 'g', cal: 13, protein: 1.1, fat: 0.2, carbs: 2.6 },
      { name: '海盐、白胡椒粉、葱花', amount: 3, unit: 'g', cal: 3, protein: 0.1, fat: 0, carbs: 0.6 }
    ],
    steps: [
      '鲜香菇洗净切薄片；嫩豆腐在盒中切成小方块备用。',
      '砂锅或汤锅中加入 500ml 清水，放入香菇片大火煮开，转中小火煮 3 分钟析出菌菇鲜香。',
      '轻轻滑入嫩豆腐块，转小火慢煮 3 分钟，保持汤水微沸。',
      '放入虾仁，煮至虾仁变色弯曲（约 1 分钟），加入少许白胡椒粉和海盐调味，洒上细葱花即可关火。'
    ],
    tips: '豆腐入锅后轻推勿猛搅，保持方块完整，汤清见底。',
    totalCal: 178,
    totalProtein: 21.6,
    totalFat: 5.9,
    totalCarbs: 9.2
  },
  {
    id: 'preset-6',
    title: '无油水炒全麦时蔬饭',
    summary: '利用少许清水或高汤替代烹调油的水炒技法，全麦饭粒粒分明，清甜多维。',
    category: '优质主食',
    prepMinutes: 15,
    difficulty: '简单',
    servings: 1,
    createdAt: '2025-01-06',
    ingredients: [
      { name: '熟糙米饭', amount: 150, unit: 'g', cal: 167, protein: 3.9, fat: 1.4, carbs: 34.5 },
      { name: '鸡蛋 (全蛋)', amount: 50, unit: 'g', cal: 74, protein: 6.4, fat: 5.0, carbs: 0.8 },
      { name: '西蓝花 (焯水切碎)', amount: 80, unit: 'g', cal: 27, protein: 3.3, fat: 0.5, carbs: 3.4 },
      { name: '生抽与海盐', amount: 6, unit: 'g', cal: 5, protein: 0.4, fat: 0, carbs: 0.8 }
    ],
    steps: [
      '准备隔夜冷藏的熟糙米饭，用勺子轻轻压散；西蓝花焯水 1 分钟后捞出切成细碎粒。',
      '不粘平底锅充分预热，倒入打散的蛋液，小火慢慢推炒成碎蛋块，盛出备用。',
      '锅中淋入 2 勺清水（约 20ml），倒入散开的糙米饭大火翻炒，水分受热蒸发带动饭粒松散。',
      '倒入炒好的鸡蛋碎和西蓝花碎，淋入 5ml 生抽，撒少许海盐快速翻炒 1 分钟至香气扑鼻即可出锅。'
    ],
    tips: '使用优质不粘锅配合少量清水快速受热，完全无需油脂也能炒出蓬松利落的炒饭。',
    totalCal: 273,
    totalProtein: 14.0,
    totalFat: 6.9,
    totalCarbs: 39.5
  }
];
