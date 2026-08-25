export type Company = {
  company: string;
  w1Sales: number;
  w2Sales: number;
  w1MarginAmount: number;
  w2MarginAmount: number;
  w1Customers: string[];
  w2Customers: string[];
};

export const dashboardPeriod = {
  previous: "08-07 ~ 08-13",
  current: "08-14 ~ 08-20",
} as const;

export const companies: Company[] = [
  {
    company: "华润西京医院", w1Sales: 472969.62, w2Sales: 438489.92, w1MarginAmount: 23736.99, w2MarginAmount: 23918.66,
    w1Customers: ["华润万家生活超市有限公司（西京医院锦苑一层）", "华润万家生活超市有限公司（西京医院锦苑二层））", "华润万家生活超市有限公司（西京医院锦苑三层））", "华润万家生活超市有限公司（西京医院卫队餐厅）", "华润万家生活超市有限公司（西京医院安居餐厅）", "华润万家生活超市有限公司（西京医院幼儿园）", "华润万家生活超市有限公司（西京医院空勤餐厅）"],
    w2Customers: ["华润万家生活超市有限公司（西京医院锦苑一层）", "华润万家生活超市有限公司（西京医院锦苑二层））", "华润万家生活超市有限公司（西京医院锦苑三层））", "华润万家生活超市有限公司（西京医院卫队餐厅）", "华润万家生活超市有限公司（西京医院安居餐厅）", "华润万家生活超市有限公司（西京医院幼儿园）", "华润万家生活超市有限公司（西京医院空勤餐厅）"],
  },
  {
    company: "西北妇幼", w1Sales: 186195.10, w2Sales: 260279.18, w1MarginAmount: 31776.78, w2MarginAmount: 49068.48,
    w1Customers: ["西安小猪配齐供应链管理有限公司（西北妇幼）（三楼）", "西安小猪配齐供应链管理有限公司（西北妇幼）(二楼病员A)", "西安小猪配齐供应链管理有限公司（西北妇幼）(一楼面点)", "西安小猪配齐供应链管理有限公司（西北妇幼）(二楼营养餐)", "西安小猪配齐供应链管理有限公司（西北妇幼）（二楼病员面点)", "西安小猪配齐供应链管理有限公司（西北妇幼）(二楼营养餐-水果)", "西安小猪配齐供应链管理有限公司（西北妇幼）(后宰门)"],
    w2Customers: ["西安小猪配齐供应链管理有限公司（西北妇幼）（三楼）", "西安小猪配齐供应链管理有限公司（西北妇幼）(二楼病员A)", "西安小猪配齐供应链管理有限公司（西北妇幼）(一楼面点)", "西安小猪配齐供应链管理有限公司（西北妇幼）(二楼营养餐)", "西安小猪配齐供应链管理有限公司（西北妇幼）（二楼病员面点)", "西安小猪配齐供应链管理有限公司（西北妇幼）(二楼营养餐-水果)", "西安小猪配齐供应链管理有限公司（西北妇幼）(后宰门)"],
  },
  { company: "中航电测", w1Sales: 133599.45, w2Sales: 121380.61, w1MarginAmount: 29037.40, w2MarginAmount: 24246.43, w1Customers: ["中航电测仪器（西安）有限公司"], w2Customers: ["中航电测仪器（西安）有限公司"] },
  { company: "115厂", w1Sales: 85257.27, w2Sales: 101252.76, w1MarginAmount: 15935.76, w2MarginAmount: 16729.17, w1Customers: ["115厂二食堂", "华润万家商业科技（陕西）有限公司（115厂一食堂)", "115厂三食堂"], w2Customers: ["115厂二食堂", "华润万家商业科技（陕西）有限公司（115厂一食堂)", "115厂三食堂"] },
  { company: "631所", w1Sales: 0, w2Sales: 97655.89, w1MarginAmount: 0, w2MarginAmount: 5920.48, w1Customers: [], w2Customers: ["631厂研究院"] },
  { company: "千古情景区餐厅", w1Sales: 62318.24, w2Sales: 68477.16, w1MarginAmount: 18054.39, w2MarginAmount: 19933.31, w1Customers: ["陕西新桂餐饮管理有限公司（千古情景区餐厅）"], w2Customers: ["陕西新桂餐饮管理有限公司（千古情景区餐厅）"] },
  { company: "口腔医院肉", w1Sales: 57774.23, w2Sales: 57654.87, w1MarginAmount: 8189.83, w2MarginAmount: 7226.09, w1Customers: ["华润万家生活超市有限公司（口腔医院肉）"], w2Customers: ["华润万家生活超市有限公司（口腔医院肉）"] },
  { company: "口腔医院干调", w1Sales: 29932.64, w2Sales: 44178.71, w1MarginAmount: 2924.92, w2MarginAmount: 3567.97, w1Customers: ["华润万家生活超市有限公司（口腔医院干调）"], w2Customers: ["华润万家生活超市有限公司（口腔医院干调）"] },
  { company: "咸阳市管局", w1Sales: 33315.05, w2Sales: 42197.11, w1MarginAmount: 2933.28, w2MarginAmount: 3660.85, w1Customers: ["咸阳市机关事务管理局", "咸阳市委"], w2Customers: ["咸阳市机关事务管理局", "咸阳市委"] },
  { company: "排水集团", w1Sales: 39562.04, w2Sales: 38926.06, w1MarginAmount: 9734.54, w2MarginAmount: 9503.14, w1Customers: ["西安排水集团有限公司"], w2Customers: ["西安排水集团有限公司"] },
  {
    company: "经开消防大队", w1Sales: 34513.97, w2Sales: 38713.30, w1MarginAmount: 4723.01, w2MarginAmount: 5307.62,
    w1Customers: ["CZ04渭环东路消防站", "CZ07凤城六路消防站", "CZ08民经一路、凤鸣路、尚稷路、永徽路", "CZ03鸿明路消防站", "CZ05渭华路消防站", "CZ06经开消防大队"],
    w2Customers: ["CZ04渭环东路消防站", "CZ07凤城六路消防站", "CZ08民经一路、凤鸣路、尚稷路、永徽路", "CZ03鸿明路消防站", "CZ05渭华路消防站", "CZ06经开消防大队"],
  },
  { company: "32705部队", w1Sales: 34146.40, w2Sales: 35956.60, w1MarginAmount: 1885.35, w2MarginAmount: 367.29, w1Customers: ["32705部队中晚"], w2Customers: ["32705部队中晚"] },
  { company: "95960部队（阎良试飞局）", w1Sales: 35673.29, w2Sales: 33830.31, w1MarginAmount: 3673.22, w2MarginAmount: 4477.63, w1Customers: ["中国人民解放军95960部队(阎良试飞局)"], w2Customers: ["中国人民解放军95960部队(阎良试飞局)"] },
  { company: "西北大学第一医院", w1Sales: 32923.85, w2Sales: 31958.35, w1MarginAmount: 3707.20, w2MarginAmount: 4008.53, w1Customers: ["西北大学第一医院"], w2Customers: ["西北大学第一医院"] },
  { company: "口腔医院蔬菜", w1Sales: 28717.62, w2Sales: 28618.58, w1MarginAmount: 2996.42, w2MarginAmount: 3167.07, w1Customers: ["华润万家生活超市有限公司（口腔医院蔬菜）"], w2Customers: ["华润万家生活超市有限公司（口腔医院蔬菜）"] },
  { company: "大修厂", w1Sales: 32222.59, w2Sales: 28162.44, w1MarginAmount: 5970.21, w2MarginAmount: 4405.56, w1Customers: ["大修厂-西安", "大修厂-临潼"], w2Customers: ["大修厂-西安", "大修厂-临潼"] },
  { company: "葛洲坝", w1Sales: 28231.45, w2Sales: 26885.03, w1MarginAmount: 2777.43, w2MarginAmount: 2646.98, w1Customers: ["中国葛洲坝集团文旅发展有限公司（葛洲坝集团三公司）"], w2Customers: ["中国葛洲坝集团文旅发展有限公司（葛洲坝集团三公司）"] },
  { company: "稀有金属", w1Sales: 22492.44, w2Sales: 24134.81, w1MarginAmount: 3990.17, w2MarginAmount: 4936.05, w1Customers: ["西安稀有金属材料研究院有限公司"], w2Customers: ["西安稀有金属材料研究院有限公司"] },
  { company: "陕西省工人疗养院", w1Sales: 12622.94, w2Sales: 20668.34, w1MarginAmount: 3071.69, w2MarginAmount: 4678.45, w1Customers: ["陕西省工人疗养院（大餐厅）"], w2Customers: ["陕西省工人疗养院（大餐厅）"] },
  { company: "交建", w1Sales: 21130.63, w2Sales: 19725.27, w1MarginAmount: 5390.48, w2MarginAmount: 4186.70, w1Customers: ["陕西交建后勤服务有限公司伙食管理委员会"], w2Customers: ["陕西交建后勤服务有限公司伙食管理委员会"] },
  { company: "秦岭宾馆", w1Sales: 8476.94, w2Sales: 14740.31, w1MarginAmount: 1214.06, w2MarginAmount: 2072.21, w1Customers: ["华润万家商业科技（陕西）有限公司（115厂秦岭宾馆）"], w2Customers: ["华润万家商业科技（陕西）有限公司（115厂秦岭宾馆）"] },
  { company: "延长石油新兴产业有限公司", w1Sales: 15537.18, w2Sales: 14531.58, w1MarginAmount: 4622.08, w2MarginAmount: 4932.42, w1Customers: ["陕西延长石油新兴产业有限公司"], w2Customers: ["陕西延长石油新兴产业有限公司"] },
  { company: "省天然气", w1Sales: 16622.13, w2Sales: 14438.27, w1MarginAmount: 2453.38, w2MarginAmount: 2679.77, w1Customers: ["省天然气"], w2Customers: ["省天然气"] },
  { company: "西安中铁轨道交通有限公司", w1Sales: 10545.30, w2Sales: 12591.60, w1MarginAmount: 717.12, w2MarginAmount: 1288.65, w1Customers: ["西安中铁轨道交通有限公司（西安地铁临潼线）"], w2Customers: ["西安中铁轨道交通有限公司（西安地铁临潼线）"] },
  { company: "盛世金源电力装备有限公司", w1Sales: 7137.06, w2Sales: 11418.13, w1MarginAmount: 1279.82, w2MarginAmount: 1898.69, w1Customers: ["陕西盛世金源电力装备有限公司"], w2Customers: ["陕西盛世金源电力装备有限公司"] },
  { company: "西咸新区轨道交通", w1Sales: 14393.28, w2Sales: 10875.95, w1MarginAmount: 3530.71, w2MarginAmount: 2206.74, w1Customers: ["西咸新区轨道交通发展有限公司（西咸沣河基地））", "西咸新区轨道交通发展有限公司"], w2Customers: ["西咸新区轨道交通发展有限公司"] },
  { company: "建行米面油", w1Sales: 7251.00, w2Sales: 9056.00, w1MarginAmount: 340.00, w2MarginAmount: 299.98, w1Customers: ["中国建设银行股份有限公司陕西省分行"], w2Customers: ["中国建设银行股份有限公司陕西省分行"] },
  { company: "电力中心医院", w1Sales: 13751.80, w2Sales: 7695.95, w1MarginAmount: 3036.90, w2MarginAmount: 2716.26, w1Customers: ["铜川金福来餐饮管理有限公司西安第一分公司"], w2Customers: ["铜川金福来餐饮管理有限公司西安第一分公司"] },
  { company: "兴平天然气", w1Sales: 3098.96, w2Sales: 3043.53, w1MarginAmount: 757.93, w2MarginAmount: 811.99, w1Customers: ["华润万家生活超市有限公司(兴平天然气)"], w2Customers: ["华润万家生活超市有限公司(兴平天然气)"] },
  { company: "未央区教育局", w1Sales: 0, w2Sales: 1707.76, w1MarginAmount: 0, w2MarginAmount: 476.13, w1Customers: [], w2Customers: ["西安市团结实验学校"] },
];
