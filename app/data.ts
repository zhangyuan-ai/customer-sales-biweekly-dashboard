import weeklySource from "./dashboard-data.json";
import weeklyHistorySource from "./dashboard-history.json";
import monthlySource from "./monthly-dashboard-data.json";
import monthlyHistorySource from "./monthly-dashboard-history.json";
import customerServiceSource from "./customer-service-map.json";

export type Customer = {
  name: string;
  w1Sales: number;
  w2Sales: number;
  w1MarginAmount: number;
  w2MarginAmount: number;
};

export type Company = {
  company: string;
  serviceOwner: string;
  w1Sales: number;
  w2Sales: number;
  w1MarginAmount: number;
  w2MarginAmount: number;
  customers: Customer[];
};

type CompanySource = Omit<Company, "serviceOwner">;
const customerServiceMap = customerServiceSource as Record<string, string>;
const withServiceOwners = (companies: CompanySource[]): Company[] => companies.map((item) => ({
  ...item,
  serviceOwner: customerServiceMap[item.company] ?? "未分配",
}));

export type DashboardPeriod = {
  start: string;
  end: string;
  label: string;
  daysCovered?: number;
  daysInMonth?: number;
  isPartial?: boolean;
};

export type HistoryPeriod = DashboardPeriod & {
  sales: number;
  marginAmount: number;
  marginRate: number;
  companyCount: number;
  customerCount: number;
};

export type DashboardDataset = {
  mode: "weekly" | "monthly";
  generatedAt: string;
  previous: DashboardPeriod;
  current: DashboardPeriod;
  companies: Company[];
  history: HistoryPeriod[];
};

export const weeklyDashboard: DashboardDataset = {
  mode: "weekly",
  generatedAt: weeklySource.generatedAt,
  previous: weeklySource.previous,
  current: weeklySource.current,
  companies: withServiceOwners(weeklySource.companies as CompanySource[]),
  history: weeklyHistorySource.periods as HistoryPeriod[],
};

export const monthlyDashboard: DashboardDataset = {
  mode: "monthly",
  generatedAt: monthlySource.generatedAt,
  previous: monthlySource.previous,
  current: monthlySource.current,
  companies: withServiceOwners(monthlySource.companies as CompanySource[]),
  history: monthlyHistorySource.periods as HistoryPeriod[],
};
