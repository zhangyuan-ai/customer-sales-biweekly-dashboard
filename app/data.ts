import weeklySource from "./dashboard-data.json";
import weeklyHistorySource from "./dashboard-history.json";
import monthlySource from "./monthly-dashboard-data.json";
import monthlyHistorySource from "./monthly-dashboard-history.json";

export type Customer = {
  name: string;
  w1Sales: number;
  w2Sales: number;
  w1MarginAmount: number;
  w2MarginAmount: number;
};

export type Company = {
  company: string;
  w1Sales: number;
  w2Sales: number;
  w1MarginAmount: number;
  w2MarginAmount: number;
  customers: Customer[];
};

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
  companies: weeklySource.companies as Company[],
  history: weeklyHistorySource.periods as HistoryPeriod[],
};

export const monthlyDashboard: DashboardDataset = {
  mode: "monthly",
  generatedAt: monthlySource.generatedAt,
  previous: monthlySource.previous,
  current: monthlySource.current,
  companies: monthlySource.companies as Company[],
  history: monthlyHistorySource.periods as HistoryPeriod[],
};
