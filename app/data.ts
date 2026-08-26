import dashboardSource from "./dashboard-data.json";
import historySource from "./dashboard-history.json";

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

export type HistoryPeriod = {
  start: string;
  end: string;
  label: string;
  sales: number;
  marginAmount: number;
  marginRate: number;
  companyCount: number;
  customerCount: number;
};

export const dashboardPeriod = {
  previous: dashboardSource.previous.label,
  current: dashboardSource.current.label,
} as const;

export const generatedAt = dashboardSource.generatedAt;
export const companies = dashboardSource.companies as Company[];
export const dashboardHistory = historySource.periods as HistoryPeriod[];
