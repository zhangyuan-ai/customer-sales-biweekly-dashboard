export type Company = {
  company: string;
  w1Sales: number;
  w2Sales: number;
  w1Margin: number;
  w2Margin: number;
  marginDelta: number;
  custW1: number;
  custW2: number;
  isNew?: boolean;
  isDropped?: boolean;
};

export const companies: Company[] = [
  { company: "华润西京医院", w1Sales: 472969.62, w2Sales: 438489.92, w1Margin: .0502, w2Margin: .0545, marginDelta: .44, custW1: 7, custW2: 7 },
  { company: "西北妇幼", w1Sales: 186195.10, w2Sales: 260279.18, w1Margin: .1707, w2Margin: .1885, marginDelta: 1.79, custW1: 7, custW2: 7 },
  { company: "中航电测", w1Sales: 133599.45, w2Sales: 121380.61, w1Margin: .2173, w2Margin: .1998, marginDelta: -1.76, custW1: 1, custW2: 1 },
  { company: "115厂", w1Sales: 85257.27, w2Sales: 101252.76, w1Margin: .1869, w2Margin: .1652, marginDelta: -2.17, custW1: 3, custW2: 3 },
  { company: "631所", w1Sales: 0, w2Sales: 97655.89, w1Margin: 0, w2Margin: .0606, marginDelta: 6.06, custW1: 0, custW2: 1, isNew: true },
  { company: "千古情景区餐厅", w1Sales: 62318.24, w2Sales: 68477.16, w1Margin: .2897, w2Margin: .2911, marginDelta: .14, custW1: 1, custW2: 1 },
  { company: "口腔医院肉", w1Sales: 57774.23, w2Sales: 57654.87, w1Margin: .1418, w2Margin: .1253, marginDelta: -1.64, custW1: 1, custW2: 1 },
  { company: "口腔医院干调", w1Sales: 29932.64, w2Sales: 44178.71, w1Margin: .0977, w2Margin: .0808, marginDelta: -1.70, custW1: 1, custW2: 1 },
  { company: "咸阳市管局", w1Sales: 33315.05, w2Sales: 42197.11, w1Margin: .0880, w2Margin: .0868, marginDelta: -.13, custW1: 2, custW2: 2 },
  { company: "排水集团", w1Sales: 39562.04, w2Sales: 38926.06, w1Margin: .2461, w2Margin: .2441, marginDelta: -.19, custW1: 1, custW2: 1 },
  { company: "经开消防大队", w1Sales: 34513.97, w2Sales: 38713.30, w1Margin: .1368, w2Margin: .1371, marginDelta: .03, custW1: 6, custW2: 6 },
  { company: "32705部队", w1Sales: 34146.40, w2Sales: 35956.60, w1Margin: .0552, w2Margin: .0102, marginDelta: -4.50, custW1: 1, custW2: 1 },
  { company: "95960部队（阎良试飞局）", w1Sales: 35673.29, w2Sales: 33830.31, w1Margin: .1030, w2Margin: .1324, marginDelta: 2.94, custW1: 1, custW2: 1 },
  { company: "西北大学第一医院", w1Sales: 32923.85, w2Sales: 31958.35, w1Margin: .1126, w2Margin: .1254, marginDelta: 1.28, custW1: 1, custW2: 1 },
  { company: "口腔医院蔬菜", w1Sales: 28717.62, w2Sales: 28618.58, w1Margin: .1043, w2Margin: .1107, marginDelta: .63, custW1: 1, custW2: 1 },
  { company: "大修厂", w1Sales: 32222.59, w2Sales: 28162.44, w1Margin: .1853, w2Margin: .1564, marginDelta: -2.88, custW1: 2, custW2: 2 },
  { company: "葛洲坝", w1Sales: 28231.45, w2Sales: 26885.03, w1Margin: .0984, w2Margin: .0985, marginDelta: .01, custW1: 1, custW2: 1 },
  { company: "稀有金属", w1Sales: 22492.44, w2Sales: 24134.81, w1Margin: .1774, w2Margin: .2045, marginDelta: 2.71, custW1: 1, custW2: 1 },
  { company: "陕西省工人疗养院", w1Sales: 12622.94, w2Sales: 20668.34, w1Margin: .2433, w2Margin: .2264, marginDelta: -1.70, custW1: 1, custW2: 1 },
  { company: "交建", w1Sales: 21130.63, w2Sales: 19725.27, w1Margin: .2551, w2Margin: .2123, marginDelta: -4.29, custW1: 1, custW2: 1 },
  { company: "秦岭宾馆", w1Sales: 8476.94, w2Sales: 14740.31, w1Margin: .1432, w2Margin: .1406, marginDelta: -.26, custW1: 1, custW2: 1 },
  { company: "延长石油新兴产业有限公司", w1Sales: 15537.18, w2Sales: 14531.58, w1Margin: .2975, w2Margin: .3394, marginDelta: 4.19, custW1: 1, custW2: 1 },
  { company: "省天然气", w1Sales: 16622.13, w2Sales: 14438.27, w1Margin: .1476, w2Margin: .1856, marginDelta: 3.80, custW1: 1, custW2: 1 },
  { company: "西安中铁轨道交通有限公司", w1Sales: 10545.30, w2Sales: 12591.60, w1Margin: .0680, w2Margin: .1023, marginDelta: 3.43, custW1: 1, custW2: 1 },
  { company: "盛世金源电力装备有限公司", w1Sales: 7137.06, w2Sales: 11418.13, w1Margin: .1793, w2Margin: .1663, marginDelta: -1.30, custW1: 1, custW2: 1 },
  { company: "西咸新区轨道交通", w1Sales: 14393.28, w2Sales: 10875.95, w1Margin: .2453, w2Margin: .2029, marginDelta: -4.24, custW1: 2, custW2: 1 },
  { company: "建行米面油", w1Sales: 7251.00, w2Sales: 9056.00, w1Margin: .0469, w2Margin: .0331, marginDelta: -1.38, custW1: 1, custW2: 1 },
  { company: "电力中心医院", w1Sales: 13751.80, w2Sales: 7695.95, w1Margin: .2208, w2Margin: .3529, marginDelta: 13.21, custW1: 1, custW2: 1 },
  { company: "兴平天然气", w1Sales: 3098.96, w2Sales: 3043.53, w1Margin: .2446, w2Margin: .2668, marginDelta: 2.22, custW1: 1, custW2: 1 },
  { company: "未央区教育局", w1Sales: 0, w2Sales: 1707.76, w1Margin: 0, w2Margin: .2788, marginDelta: 27.88, custW1: 0, custW2: 1, isNew: true },
];
