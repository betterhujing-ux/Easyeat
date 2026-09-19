import { FoodItem } from '../types';

export const FOODS_DATABASE: FoodItem[] = [
  // 禽肉水产及蛋奶类 (优质蛋白质)
  { id: 'f-01', name: '鸡胸肉 (生/去皮)', category: '肉蛋水产', cal: 133, protein: 24.6, fat: 1.9, carbs: 2.5, servingDesc: '一块巴掌大约 150g' },
  { id: 'f-02', name: '鸡腿肉 (生/去皮)', category: '肉蛋水产', cal: 140, protein: 20.2, fat: 6.7, carbs: 0.1, servingDesc: '一只去骨去皮约 120g' },
  { id: 'f-03', name: '牛里脊 (瘦牛肉)', category: '肉蛋水产', cal: 107, protein: 22.2, fat: 0.9, carbs: 0.2, servingDesc: '手掌心大小约 100g' },
  { id: 'f-04', name: '瘦猪肉 (里脊)', category: '肉蛋水产', cal: 143, protein: 20.3, fat: 6.2, carbs: 1.5, servingDesc: '普通一份约 100g' },
  { id: 'f-05', name: '三文鱼 (生肉)', category: '肉蛋水产', cal: 139, protein: 17.2, fat: 7.8, carbs: 0.0, servingDesc: '一块鱼排约 150g' },
  { id: 'f-06', name: '鲜虾仁 (生)', category: '肉蛋水产', cal: 48, protein: 10.4, fat: 0.7, carbs: 0.0, servingDesc: '约 6-8 只中等虾' },
  { id: 'f-07', name: '巴沙鱼/龙利鱼柳', category: '肉蛋水产', cal: 88, protein: 15.0, fat: 2.5, carbs: 0.5, servingDesc: '一片鱼柳约 200g' },
  { id: 'f-08', name: '鸡蛋 (全蛋带壳)', category: '肉蛋水产', cal: 147, protein: 12.8, fat: 10.0, carbs: 1.5, servingDesc: '一个标准鸡蛋约 50g' },
  { id: 'f-09', name: '纯鸡蛋白', category: '肉蛋水产', cal: 52, protein: 11.6, fat: 0.1, carbs: 1.0, servingDesc: '一个鸡蛋清约 35g' },
  { id: 'f-10', name: '纯牛奶 (全脂)', category: '肉蛋水产', cal: 54, protein: 3.0, fat: 3.2, carbs: 3.4, servingDesc: '一玻璃杯约 250ml' },
  { id: 'f-11', name: '脱脂牛奶', category: '肉蛋水产', cal: 35, protein: 3.3, fat: 0.2, carbs: 4.8, servingDesc: '一盒约 250ml' },
  { id: 'f-12', name: '无糖希腊酸奶', category: '肉蛋水产', cal: 60, protein: 9.0, fat: 0.2, carbs: 4.0, servingDesc: '一小杯约 100g' },
  { id: 'f-13', name: '北豆腐 (老豆腐)', category: '肉蛋水产', cal: 98, protein: 12.2, fat: 4.8, carbs: 1.5, servingDesc: '半块豆腐约 150g' },
  { id: 'f-14', name: '嫩豆腐 (内酯豆腐)', category: '肉蛋水产', cal: 57, protein: 5.0, fat: 2.5, carbs: 3.0, servingDesc: '一盒约 350g' },

  // 谷物薯类主食 (碳水化合物)
  { id: 'f-15', name: '白米饭 (熟)', category: '主食谷薯', cal: 116, protein: 2.6, fat: 0.3, carbs: 25.9, servingDesc: '家用平碗一碗约 150g' },
  { id: 'f-16', name: '糙米饭 (熟)', category: '主食谷薯', cal: 111, protein: 2.6, fat: 0.9, carbs: 23.0, servingDesc: '一小碗约 130g' },
  { id: 'f-17', name: '纯燕麦片 (干)', category: '主食谷薯', cal: 389, protein: 15.0, fat: 6.7, carbs: 67.2, servingDesc: '4 汤匙约 40g' },
  { id: 'f-18', name: '红薯 (熟/蒸)', category: '主食谷薯', cal: 90, protein: 1.1, fat: 0.2, carbs: 20.7, servingDesc: '一个中等红薯约 150g' },
  { id: 'f-19', name: '紫薯 (熟/蒸)', category: '主食谷薯', cal: 106, protein: 1.6, fat: 0.2, carbs: 24.7, servingDesc: '一个约 120g' },
  { id: 'f-20', name: '甜玉米 (熟)', category: '主食谷薯', cal: 112, protein: 4.0, fat: 1.2, carbs: 22.8, servingDesc: '一根整棒约 200g (可食)' },
  { id: 'f-21', name: '全麦吐司面包', category: '主食谷薯', cal: 246, protein: 8.5, fat: 2.5, carbs: 47.0, servingDesc: '一片约 35g' },
  { id: 'f-22', name: '荞麦面 (熟/沥干)', category: '主食谷薯', cal: 110, protein: 4.5, fat: 0.7, carbs: 21.0, servingDesc: '一碗熟面约 150g' },
  { id: 'f-23', name: '土豆 (熟/蒸)', category: '主食谷薯', cal: 76, protein: 2.0, fat: 0.2, carbs: 17.2, servingDesc: '一个拳头大小约 130g' },

  // 蔬菜及菌藻类 (膳食纤维与微量元素)
  { id: 'f-24', name: '西蓝花 (生/焯水)', category: '蔬菜菌菇', cal: 34, protein: 4.1, fat: 0.6, carbs: 4.3, servingDesc: '一大捧约 100g' },
  { id: 'f-25', name: '菠菜 (鲜)', category: '蔬菜菌菇', cal: 28, protein: 2.6, fat: 0.3, carbs: 4.5, servingDesc: '一大把约 150g' },
  { id: 'f-26', name: '芦笋 (鲜)', category: '蔬菜菌菇', cal: 22, protein: 2.2, fat: 0.1, carbs: 4.1, servingDesc: '5-6 根约 100g' },
  { id: 'f-27', name: '生番茄/西红柿', category: '蔬菜菌菇', cal: 18, protein: 0.9, fat: 0.2, carbs: 3.3, servingDesc: '一个中等番茄约 150g' },
  { id: 'f-28', name: '黄瓜', category: '蔬菜菌菇', cal: 15, protein: 0.8, fat: 0.2, carbs: 2.9, servingDesc: '一根黄瓜约 150g' },
  { id: 'f-29', name: '球生菜/罗马生菜', category: '蔬菜菌菇', cal: 15, protein: 1.3, fat: 0.4, carbs: 2.2, servingDesc: '一小盘约 100g' },
  { id: 'f-30', name: '鲜香菇', category: '蔬菜菌菇', cal: 26, protein: 2.2, fat: 0.3, carbs: 5.2, servingDesc: '4 朵约 80g' },
  { id: 'f-31', name: '黑木耳 (水发)', category: '蔬菜菌菇', cal: 27, protein: 1.5, fat: 0.2, carbs: 6.0, servingDesc: '一小把泡发约 50g' },
  { id: 'f-32', name: '彩椒 (红/黄甜椒)', category: '蔬菜菌菇', cal: 26, protein: 1.0, fat: 0.2, carbs: 5.3, servingDesc: '半个约 80g' },

  // 水果及健康油脂类
  { id: 'f-33', name: '牛油果 (鳄梨)', category: '水果油脂', cal: 160, protein: 2.0, fat: 14.7, carbs: 8.5, servingDesc: '半个果肉约 70g' },
  { id: 'f-34', name: '香蕉 (去皮)', category: '水果油脂', cal: 93, protein: 1.4, fat: 0.2, carbs: 22.0, servingDesc: '一根中等香蕉约 100g' },
  { id: 'f-35', name: '红富士苹果 (带皮)', category: '水果油脂', cal: 53, protein: 0.2, fat: 0.2, carbs: 13.5, servingDesc: '一个中等苹果约 180g' },
  { id: 'f-36', name: '鲜蓝莓', category: '水果油脂', cal: 57, protein: 0.7, fat: 0.3, carbs: 14.5, servingDesc: '一盒约 125g' },
  { id: 'f-37', name: '特级初榨橄榄油', category: '水果油脂', cal: 899, protein: 0.0, fat: 99.9, carbs: 0.0, servingDesc: '一汤匙约 10g' },
  { id: 'f-38', name: '原味巴旦木 (坚果)', category: '水果油脂', cal: 579, protein: 21.2, fat: 49.9, carbs: 21.6, servingDesc: '一小把 10 颗约 15g' }
];
