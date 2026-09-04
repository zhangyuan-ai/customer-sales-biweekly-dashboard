"use client";

import { useMemo, useState } from "react";
import { monthlyDashboard, weeklyDashboard, type Company, type Customer, type HistoryPeriod } from "./data";

type Filter = "all" | "new" | "dropped" | "negative" | "down" | "marginDown" | "quality";
type SortKey = "company" | "serviceOwner" | "w1Sales" | "w2Sales" | "salesDelta" | "w1Margin" | "w2Margin" | "marginDelta" | "custW2";

const money = (value: number) => `¥${Math.round(value).toLocaleString("zh-CN")}`;
const signedMoney = (value: number) => `${value > 0 ? "+" : value < 0 ? "−" : ""}${money(Math.abs(value))}`;
const percent = (value: number) => `${(value * 100).toFixed(2)}%`;
const signed = (value: number, digits = 1) => `${value > 0 ? "+" : ""}${value.toFixed(digits)}%`;
const previousMargin = (item: Company) => item.w1Sales ? item.w1MarginAmount / item.w1Sales : 0;
const currentMargin = (item: Company) => item.w2Sales ? item.w2MarginAmount / item.w2Sales : 0;
const customerCurrentMargin = (item: Customer) => item.w2Sales ? item.w2MarginAmount / item.w2Sales : 0;
const companyMarginDelta = (item: Company) => (currentMargin(item) - previousMargin(item)) * 100;
const isNewCompany = (item: Company) => item.w1Sales <= 0 && item.w2Sales > 0;
const isDroppedCompany = (item: Company) => item.w1Sales > 0 && item.w2Sales <= 0;
const isComparableCompany = (item: Company) => item.w1Sales > 0 && item.w2Sales > 0;
const hasZeroMarginWithSales = (item: Pick<Company, "w2Sales" | "w2MarginAmount">) => item.w2Sales > 0 && Math.abs(item.w2MarginAmount) < 0.005;
const previousCustomerCount = (item: Company) => item.customers.filter((customer) => customer.w1Sales > 0).length;
const currentCustomerCount = (item: Company) => item.customers.filter((customer) => customer.w2Sales > 0).length;
const status = (item: Company, currentScale = 1) => isNewCompany(item) ? "新增" : isDroppedCompany(item) ? "流失" : item.w2Sales * currentScale < item.w1Sales ? "销售下滑" : "增长";

const ratioChange = (current: number, previous: number) => previous ? (current - previous) / previous : 0;
const metricTone = (value: number) => value < 0 ? "down" : "up";

const summarizeCompanies = (items: Company[]) => items.length
  ? `${items.slice(0, 2).map((item) => item.company).join("、")}${items.length > 2 ? " 等" : ""}`
  : "无";


const backgrounds: { label: string; src: string | null }[] = [
  { label: "静态背景", src: null },
  { label: "背景 1", src: "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260629_030107_874273ea-684a-4e90-bb96-8fdfde48d53d.mp4" },
  { label: "背景 2", src: "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260629_032424_3c9c2a9d-807b-4482-80e6-dd6d9dfd4545.mp4" },
  { label: "背景 3", src: "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260627_094019_4214ea73-b963-46a4-8327-61489192de99.mp4" },
];

const filters: { key: Filter; label: string }[] = [
  { key: "all", label: "全部" }, { key: "new", label: "新增" }, { key: "dropped", label: "流失" },
  { key: "negative", label: "负毛利" }, { key: "down", label: "销售下滑" }, { key: "marginDown", label: "毛利下滑" },
  { key: "quality", label: "待核查" },
];

function SectionTitle({ children, note }: { children: React.ReactNode; note?: string }) {
  return <div className="section-title"><span /><div><h2>{children}</h2>{note && <p>{note}</p>}</div></div>;
}

function SalesChart({ companies, previousLabel, currentLabel }: { companies: Company[]; previousLabel: string; currentLabel: string }) {
  const rows = [...companies].sort((a, b) => b.w2Sales - a.w2Sales).slice(0, 8);
  const max = Math.max(...rows.flatMap((item) => [item.w1Sales, item.w2Sales]));
  return <div className="bar-chart sales-chart" aria-label={`${previousLabel}与${currentLabel}销售额对比`}>
    {rows.map((item) => <div className="bar-row" key={item.company}>
      <span className="bar-label" title={item.company}>{item.company}</span>
      <div className="paired-bars">
        <i className="bar-old" style={{ width: `${Math.max(1, item.w1Sales / max * 100)}%` }} />
        <i className="bar-new" style={{ width: `${Math.max(1, item.w2Sales / max * 100)}%` }} />
      </div>
      <b>{money(item.w2Sales)}</b>
    </div>)}
  </div>;
}

function MarginDeltaChart({ companies }: { companies: Company[] }) {
  const comparableCompanies = companies.filter(isComparableCompany);
  const rows = [...comparableCompanies].sort((a, b) => Math.abs(companyMarginDelta(b)) - Math.abs(companyMarginDelta(a))).slice(0, 8);
  const max = Math.max(...rows.map((item) => Math.abs(companyMarginDelta(item))), 1);
  return <div className="delta-chart">
    {rows.map((item) => { const delta = companyMarginDelta(item); return <div className="delta-row" key={item.company}>
      <span title={item.company}>{item.company}</span>
      <div className="delta-track"><i className={delta >= 0 ? "positive" : "negative"} style={{ width: `${Math.max(2, Math.abs(delta) / max * 100)}%` }} /></div>
      <b className={delta >= 0 ? "up" : "down"}>{signed(delta, 2)}</b>
    </div>; })}
  </div>;
}

function MarginRank({ high, companies }: { high: boolean; companies: Company[] }) {
  const rows = companies
    .filter((item) => item.w2Sales > 0)
    .sort((a, b) => high ? currentMargin(b) - currentMargin(a) : currentMargin(a) - currentMargin(b))
    .slice(0, 10);
  const max = Math.max(...rows.map(currentMargin), 0.01);
  return <ol className="rank-list">
    {rows.map((item, index) => <li key={item.company}>
      <em>{index + 1}</em><span className="rank-company" title={item.company}>{item.company}</span>
      <span className="owner-badge" data-owner={item.serviceOwner}>{item.serviceOwner}</span>
      <div><i className={high ? "rank-high" : "rank-low"} style={{ width: `${Math.max(3, currentMargin(item) / max * 100)}%` }} /></div>
      <b>{percent(currentMargin(item))}</b>
    </li>)}
  </ol>;
}

function HistoryTrend({ history, mode }: { history: HistoryPeriod[]; mode: "weekly" | "monthly" }) {
  const maxSales = Math.max(...history.map((item) => item.sales), 1);
  return <div className="history-card">
    <div className="history-heading"><div><h3>销售与毛利历史趋势</h3><p>自动保留最近 12 {mode === "monthly" ? "个月" : "期"}，当前已累计 {history.length} 期</p></div><span>销售额 / 毛利率</span></div>
    <div className="history-chart" role="img" aria-label="最近各期销售额和毛利率趋势">
      {history.map((item) => <article key={`${item.start}-${item.end}`} className={item.isPartial ? "partial-period" : ""}>
        <div className="history-value"><strong>{money(item.sales)}</strong><span>{percent(item.marginRate)}</span></div>
        <div className="history-bar-track"><i style={{ height: `${Math.max(8, item.sales / maxSales * 100)}%` }} /></div>
        <b>{item.label}</b><small>{item.companyCount} 家公司 · {item.customerCount} 个客户{item.isPartial ? " · 累计" : ""}</small>
      </article>)}
    </div>
  </div>;
}

export default function Home() {
  const [mode, setMode] = useState<"weekly" | "monthly">("weekly");
  const [background, setBackground] = useState(0);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Filter>("all");
  const [ownerFilter, setOwnerFilter] = useState("all");
  const [sortKey, setSortKey] = useState<SortKey>("w2Sales");
  const [ascending, setAscending] = useState(false);
  const activeBackground = backgrounds[background];
  const dashboard = mode === "monthly" ? monthlyDashboard : weeklyDashboard;
  const companies = dashboard.companies;
  const isMonthly = mode === "monthly";
  const isPartialMonth = isMonthly && Boolean(dashboard.current.isPartial);
  const previousDays = dashboard.previous.daysCovered ?? 1;
  const currentDays = dashboard.current.daysCovered ?? 1;
  const currentMonthDays = dashboard.current.daysInMonth ?? currentDays;
  const currentScale = isPartialMonth ? currentMonthDays / currentDays : 1;
  const currentLabel = isMonthly ? "本月" : "本周";
  const previousLabel = isMonthly ? "上月" : "上周";
  const comparisonLabel = isMonthly ? "月度环比" : "环比";
  const totals = companies.reduce((sum, item) => ({
    w1Sales: sum.w1Sales + item.w1Sales,
    w2Sales: sum.w2Sales + item.w2Sales,
    w1MarginAmount: sum.w1MarginAmount + item.w1MarginAmount,
    w2MarginAmount: sum.w2MarginAmount + item.w2MarginAmount,
  }), { w1Sales: 0, w2Sales: 0, w1MarginAmount: 0, w2MarginAmount: 0 });
  const serviceOwners = [...new Set(companies.map((item) => item.serviceOwner))]
    .sort((a, b) => a === "未分配" ? 1 : b === "未分配" ? -1 : a.localeCompare(b, "zh-CN"));
  const ownerSummaries = serviceOwners.map((owner) => {
    const ownerCompanies = companies.filter((item) => item.serviceOwner === owner);
    const summary = ownerCompanies.reduce((sum, item) => ({
      w1Sales: sum.w1Sales + item.w1Sales,
      w2Sales: sum.w2Sales + item.w2Sales,
      w1MarginAmount: sum.w1MarginAmount + item.w1MarginAmount,
      w2MarginAmount: sum.w2MarginAmount + item.w2MarginAmount,
    }), { w1Sales: 0, w2Sales: 0, w1MarginAmount: 0, w2MarginAmount: 0 });
    const topContributor = [...ownerCompanies]
      .filter((item) => item.w2MarginAmount > 0)
      .sort((a, b) => b.w2MarginAmount - a.w2MarginAmount)[0];
    const riskCount = ownerCompanies.filter((item) => item.w2Sales > 0 && (currentMargin(item) < 0 || (isComparableCompany(item) && companyMarginDelta(item) < 0))).length;
    return {
      owner,
      ...summary,
      marginRate: summary.w2Sales ? summary.w2MarginAmount / summary.w2Sales : 0,
      marginChange: ratioChange(summary.w2MarginAmount * currentScale, summary.w1MarginAmount),
      companyCount: ownerCompanies.filter((item) => item.w2Sales > 0).length,
      topContributor: topContributor?.company ?? "无",
      riskCount,
    };
  });
  const previousMarginRate = totals.w1Sales ? totals.w1MarginAmount / totals.w1Sales : 0;
  const currentMarginRate = totals.w2Sales ? totals.w2MarginAmount / totals.w2Sales : 0;
  const previousCompanyCount = companies.filter((item) => item.w1Sales > 0).length;
  const currentCompanyCount = companies.filter((item) => item.w2Sales > 0).length;
  const salesDelta = totals.w2Sales * currentScale - totals.w1Sales;
  const marginAmountDelta = totals.w2MarginAmount * currentScale - totals.w1MarginAmount;
  const marginRateDelta = (currentMarginRate - previousMarginRate) * 100;
  const salesPaceDelta = ratioChange(totals.w2Sales / currentDays, totals.w1Sales / previousDays);
  const marginPaceDelta = ratioChange(totals.w2MarginAmount / currentDays, totals.w1MarginAmount / previousDays);
  const projectedSales = totals.w2Sales * currentScale;
  const projectedMargin = totals.w2MarginAmount * currentScale;
  const metrics = [
    { label: isPartialMonth ? "本月累计销售额" : `${currentLabel}销售额`, value: money(totals.w2Sales), change: isPartialMonth ? `${signed(salesPaceDelta * 100)} 日均节奏` : `${signed(ratioChange(totals.w2Sales, totals.w1Sales) * 100)} ${comparisonLabel}`, tone: metricTone(isPartialMonth ? salesPaceDelta : totals.w2Sales - totals.w1Sales), glyph: "¥" },
    { label: isPartialMonth ? "本月累计参考毛利额" : `${currentLabel}参考毛利额`, value: money(totals.w2MarginAmount), change: isPartialMonth ? `${signed(marginPaceDelta * 100)} 日均节奏` : `${signed(ratioChange(totals.w2MarginAmount, totals.w1MarginAmount) * 100)} ${comparisonLabel}`, tone: metricTone(isPartialMonth ? marginPaceDelta : totals.w2MarginAmount - totals.w1MarginAmount), glyph: "利" },
    { label: `${currentLabel}毛利率`, value: percent(currentMarginRate), change: `${signed(marginRateDelta, 2)} ${comparisonLabel}`, tone: metricTone(marginRateDelta), glyph: "%" },
    { label: "客户公司数", value: String(currentCompanyCount), change: `${currentCompanyCount - previousCompanyCount > 0 ? "+" : ""}${currentCompanyCount - previousCompanyCount} 家 ${comparisonLabel}`, tone: metricTone(currentCompanyCount - previousCompanyCount), glyph: "客" },
  ];
  const newCompanies = companies.filter(isNewCompany);
  const droppedCompanies = companies.filter(isDroppedCompany);
  const comparableCompanies = companies.filter(isComparableCompany);
  const salesDownCompanies = comparableCompanies.filter((item) => item.w2Sales * currentScale < item.w1Sales);
  const marginDownCompanies = comparableCompanies.filter((item) => companyMarginDelta(item) < 0);
  const alerts = [
    { label: "新增公司", value: newCompanies.length, detail: summarizeCompanies(newCompanies), tone: "new", action: "new" as Filter },
    { label: "流失公司", value: droppedCompanies.length, detail: summarizeCompanies(droppedCompanies), tone: "drop", action: "dropped" as Filter },
    { label: isPartialMonth ? "预计销售下滑公司" : "销售额下滑公司", value: salesDownCompanies.length, detail: summarizeCompanies(salesDownCompanies), tone: "sales", action: "down" as Filter },
    { label: "毛利率下滑公司", value: marginDownCompanies.length, detail: summarizeCompanies(marginDownCompanies), tone: "margin", action: "marginDown" as Filter },
  ];
  const growthCompanies = [...comparableCompanies].filter((item) => item.w2Sales * currentScale > item.w1Sales).sort((a, b) => (b.w2Sales * currentScale - b.w1Sales) - (a.w2Sales * currentScale - a.w1Sales));
  const declineCompanies = [...comparableCompanies].filter((item) => item.w2Sales * currentScale < item.w1Sales).sort((a, b) => (a.w2Sales * currentScale - a.w1Sales) - (b.w2Sales * currentScale - b.w1Sales));
  const marginGrowthCompanies = [...comparableCompanies]
    .filter((item) => item.w2MarginAmount * currentScale > item.w1MarginAmount)
    .sort((a, b) => (b.w2MarginAmount * currentScale - b.w1MarginAmount) - (a.w2MarginAmount * currentScale - a.w1MarginAmount));
  const marginRiskCompanies = [...comparableCompanies]
    .filter((item) => companyMarginDelta(item) < 0)
    .sort((a, b) => companyMarginDelta(a) - companyMarginDelta(b));
  const topGrowth = growthCompanies[0];
  const topDecline = declineCompanies[0];
  const topMarginGrowth = marginGrowthCompanies[0];
  const topMarginRisk = marginRiskCompanies[0];
  const insightCards = [
    topGrowth && { label: isPartialMonth ? "预计销售增长贡献最大" : "销售增长贡献最大", company: topGrowth.company, value: signedMoney(topGrowth.w2Sales * currentScale - topGrowth.w1Sales), tone: "up", companyData: topGrowth },
    topDecline && { label: isPartialMonth ? "预计销售下滑影响最大" : "销售下滑影响最大", company: topDecline.company, value: signedMoney(topDecline.w2Sales * currentScale - topDecline.w1Sales), tone: "down", companyData: topDecline },
    topMarginGrowth && { label: isPartialMonth ? "预计毛利额增长贡献最大" : "毛利额增长贡献最大", company: topMarginGrowth.company, value: signedMoney(topMarginGrowth.w2MarginAmount * currentScale - topMarginGrowth.w1MarginAmount), tone: "up", companyData: topMarginGrowth },
    topMarginRisk && { label: "毛利率降幅最大", company: topMarginRisk.company, value: signed(companyMarginDelta(topMarginRisk), 2), tone: "down", companyData: topMarginRisk },
  ].filter(Boolean) as { label: string; company: string; value: string; tone: "up" | "down"; companyData: Company }[];
  const growthDrivers = growthCompanies.slice(0, 2).map((item) => item.company).join("、");
  const insightNarrative = isPartialMonth
    ? `本月已统计 ${currentDays}/${currentMonthDays} 天，累计销售额 ${money(totals.w2Sales)}；日均销售节奏较上月${salesPaceDelta >= 0 ? "提升" : "下降"}${Math.abs(salesPaceDelta * 100).toFixed(1)}%，按当前节奏预计月底销售额 ${money(projectedSales)}。预计参考毛利额 ${money(projectedMargin)}，当前综合毛利率较上月${marginRateDelta >= 0 ? "提升" : "下降"}${Math.abs(marginRateDelta).toFixed(2)} 个百分点。`
    : `${currentLabel}销售额较${previousLabel}${salesDelta >= 0 ? "增长" : "下降"}${money(Math.abs(salesDelta))}，${growthDrivers ? `主要增长来自${growthDrivers}` : "暂无明显增长来源"}；参考毛利额${marginAmountDelta >= 0 ? "增长" : "下降"}${money(Math.abs(marginAmountDelta))}，综合毛利率${marginRateDelta >= 0 ? "提升" : "下降"}${Math.abs(marginRateDelta).toFixed(2)} 个百分点。`;
  const dataUpdatedLabel = dashboard.generatedAt.replace("T", " ").slice(0, 16);

  const rows = useMemo(() => {
    const match = companies.filter((item) => {
      const byQuery = item.company.toLowerCase().includes(query.trim().toLowerCase());
      const byFilter = filter === "all" || (filter === "new" && isNewCompany(item)) || (filter === "dropped" && isDroppedCompany(item))
        || (filter === "negative" && item.w2Sales > 0 && currentMargin(item) < 0)
        || (filter === "down" && isComparableCompany(item) && item.w2Sales * currentScale < item.w1Sales)
        || (filter === "marginDown" && isComparableCompany(item) && companyMarginDelta(item) < 0)
        || (filter === "quality" && hasZeroMarginWithSales(item));
      const byOwner = ownerFilter === "all" || item.serviceOwner === ownerFilter;
      return byQuery && byFilter && byOwner;
    });
    return match.sort((a, b) => {
      const av = sortKey === "salesDelta" ? a.w2Sales * currentScale - a.w1Sales : sortKey === "marginDelta" ? companyMarginDelta(a)
        : sortKey === "w1Margin" ? previousMargin(a) : sortKey === "w2Margin" ? currentMargin(a)
          : sortKey === "custW2" ? currentCustomerCount(a) : a[sortKey];
      const bv = sortKey === "salesDelta" ? b.w2Sales * currentScale - b.w1Sales : sortKey === "marginDelta" ? companyMarginDelta(b)
        : sortKey === "w1Margin" ? previousMargin(b) : sortKey === "w2Margin" ? currentMargin(b)
          : sortKey === "custW2" ? currentCustomerCount(b) : b[sortKey];
      const result = typeof av === "string" ? av.localeCompare(String(bv), "zh-CN") : Number(av) - Number(bv);
      return ascending ? result : -result;
    });
  }, [query, filter, ownerFilter, sortKey, ascending, companies, currentScale]);

  const sortBy = (key: SortKey) => {
    if (key === sortKey) setAscending((value) => !value);
    else { setSortKey(key); setAscending(false); }
  };

  const switchMode = (nextMode: "weekly" | "monthly") => {
    setMode(nextMode);
    setSelectedCompany(null);
    setQuery("");
    setFilter("all");
    setOwnerFilter("all");
    setSortKey("w2Sales");
    setAscending(false);
  };

  const customerRows = selectedCompany?.customers ?? [];
  const currentCustomers = customerRows.filter((item) => item.w2Sales > 0);
  const previousCustomers = customerRows.filter((item) => item.w1Sales > 0);

  const headers: [SortKey, string][] = [
    ["company", "客户公司"], ["serviceOwner", "客服员"], ["w1Sales", `${previousLabel}销售额`], ["w2Sales", isPartialMonth ? "本月累计销售额" : `${currentLabel}销售额`], ["salesDelta", isPartialMonth ? "预计月底销售差额" : "销售额环比金额"],
    ["w1Margin", `${previousLabel}毛利率`], ["w2Margin", `${currentLabel}毛利率`], ["marginDelta", "毛利率环比(%)"], ["custW2", "下属客户"],
  ];

  return <main className="dashboard-shell reference-theme">
    <div className="video-background" aria-hidden="true">
      {activeBackground.src && <video key={background} autoPlay muted loop playsInline preload="none">
        <source src={activeBackground.src} type="video/mp4" />
      </video>}
      <span />
    </div>
    <div className="dashboard-wrap">
    <header className="dashboard-header">
      <div><p className="eyebrow">西安望家欢农业科技有限公司</p><h1>客户销售与毛利经营看板</h1><p className="subtitle">按「客户公司」维度汇总 · 销售额与毛利率环比 · 点击公司行查看下属客户名单</p></div>
      <div className="header-controls">
        <div className="period-mode-switch" aria-label="切换周环比或月环比">
          <button type="button" className={mode === "weekly" ? "active" : ""} onClick={() => switchMode("weekly")}>周环比</button>
          <button type="button" className={mode === "monthly" ? "active" : ""} onClick={() => switchMode("monthly")}>月环比</button>
        </div>
        <div className="period-chip"><span>对比周期</span><strong>{dashboard.previous.label}</strong><i>→</i><strong>{dashboard.current.label}</strong></div>
        <div className="data-updated"><span>数据更新</span><strong>{dataUpdatedLabel}</strong></div>
        <div className="background-switcher" aria-label="切换动态背景">
          {backgrounds.map((item, index) => <button type="button" key={item.label} className={background === index ? "active" : ""} onClick={() => setBackground(index)} aria-label={`切换至${item.label}`}><b>{item.label}</b></button>)}
        </div>
      </div>
    </header>

    {isPartialMonth && <section className="partial-month-banner" aria-label="本月数据口径说明">
      <div><span>本月进度</span><strong>{currentDays}/{currentMonthDays} 天</strong></div>
      <div className="month-progress-track"><i style={{ width: `${Math.min(100, currentDays / currentMonthDays * 100)}%` }} /></div>
      <p>8月尚未结束，金额为截至 {currentDays} 日的累计值；“预计月底”按当前日均节奏折算，月底导入完整报表后自动恢复为实际整月环比。</p>
    </section>}

    <section className="metric-grid" aria-label="核心指标">{metrics.map((metric, index) => <article className="metric-card" key={metric.label}>
      <div className={`metric-icon icon-${index + 1}`} aria-hidden="true">{metric.glyph}</div><p>{metric.label}</p><strong>{metric.value}</strong><span className={metric.tone}>{metric.change}</span>
    </article>)}</section>

    <section className="content-section insight-section">
      <SectionTitle note="贡献榜仅比较两期均有销售的公司；点击卡片查看公司明细">本期经营结论</SectionTitle>
      <div className="insight-summary"><span>自动洞察</span><p>{insightNarrative}</p></div>
      <div className="insight-grid">{insightCards.map((item) => <button type="button" key={item.label} onClick={() => setSelectedCompany(item.companyData)} aria-label={`查看${item.company}经营明细`}>
        <p>{item.label}</p><strong>{item.company}</strong><span className={item.tone}>{item.value}</span><i aria-hidden="true">↗</i>
      </button>)}</div>
    </section>

    <section className="alert-grid" aria-label="经营提醒">{alerts.map((alert) => <button type="button" className={`alert-card alert-${alert.tone}`} key={alert.label} onClick={() => setFilter(alert.action)}>
      <p>{alert.label}</p><strong>{alert.value}</strong><span>{alert.detail}</span>
    </button>)}</section>

    <section className="content-section owner-section">
      <SectionTitle note={`按客服员名下客户公司汇总${currentLabel}销售额、参考毛利额和综合毛利率；点击卡片可筛选明细`}>客服员毛利汇总</SectionTitle>
      <div className="owner-summary-grid">
        {ownerSummaries.map((item) => <button type="button" className={`owner-summary-card ${ownerFilter === item.owner ? "active" : ""}`} data-owner={item.owner} key={item.owner} onClick={() => setOwnerFilter((value) => value === item.owner ? "all" : item.owner)} aria-pressed={ownerFilter === item.owner}>
          <header><strong>{item.owner}</strong><span>{item.companyCount} 家公司</span></header>
          <p>{isPartialMonth ? "本月累计参考毛利额" : `${currentLabel}参考毛利额`}</p>
          <b>{money(item.w2MarginAmount)}</b>
          <div className="owner-metrics"><span>销售额<strong>{money(item.w2Sales)}</strong></span><span>综合毛利率<strong>{percent(item.marginRate)}</strong></span></div>
          <footer><span className={item.marginChange >= 0 ? "up" : "down"}>{signed(item.marginChange * 100)} {isPartialMonth ? "预计月度环比" : comparisonLabel}</span><small>贡献最大：{item.topContributor} · 风险 {item.riskCount} 家</small></footer>
        </button>)}
      </div>
    </section>

    <section className="content-section">
      <SectionTitle note={`每次导入新${isMonthly ? "月报" : "周报"}后自动追加，最多显示最近 12 ${isMonthly ? "个月" : "期"}`}>历史经营趋势</SectionTitle>
      <HistoryTrend history={dashboard.history} mode={mode} />
    </section>

    <section className="content-section">
      <SectionTitle note="销售规模、毛利率波动与高低位公司一屏对比">公司销售与毛利率可视化</SectionTitle>
      <div className="chart-grid">
        <article className="chart-card chart-wide"><div className="chart-heading"><h3>销售额 TOP 8</h3><div className="legend"><span><i className="old" />{dashboard.previous.label}</span><span><i className="current" />{dashboard.current.label}</span></div></div><SalesChart companies={companies} previousLabel={dashboard.previous.label} currentLabel={dashboard.current.label} /></article>
        <article className="chart-card chart-wide"><div className="chart-heading"><h3>毛利率波动聚焦</h3><small>仅展示两{isMonthly ? "月" : "周"}均有数据 · 百分点</small></div><MarginDeltaChart companies={companies} /></article>
        <article className="chart-card"><div className="chart-heading"><h3>{currentLabel}毛利率最低 Top 10</h3><small className="rank-red">低位 · 仅含本期有销售</small></div><MarginRank high={false} companies={companies} /></article>
        <article className="chart-card"><div className="chart-heading"><h3>{currentLabel}毛利率最高 Top 10</h3><small className="rank-green">高位 · 仅含本期有销售</small></div><MarginRank high companies={companies} /></article>
      </div>
    </section>

    <section className="content-section table-section">
      <SectionTitle note="点击表头可排序，使用状态标签快速聚焦异常公司">客户公司汇总明细</SectionTitle>
      <div className="toolbar">
        <label className="search-box"><span aria-hidden="true">⌕</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="搜索客户公司…" aria-label="搜索客户公司" /></label>
        <div className="pills">{filters.map((item) => <button type="button" key={item.key} className={filter === item.key ? "active" : ""} onClick={() => setFilter(item.key)}>{item.label}</button>)}</div>
        <span className="row-count">共 {rows.length} 家公司</span>
      </div>
      <div className="owner-filter-bar" aria-label="按客服员筛选"><span>客服员</span><div className="pills"><button type="button" className={ownerFilter === "all" ? "active" : ""} onClick={() => setOwnerFilter("all")}>全部</button>{serviceOwners.map((owner) => <button type="button" data-owner={owner} key={owner} className={ownerFilter === owner ? "active" : ""} onClick={() => setOwnerFilter(owner)}>{owner}</button>)}</div></div>
      <div className="table-scroll"><table><thead><tr>{headers.map(([key, label]) => <th key={key}><button type="button" onClick={() => sortBy(key)}>{label}<span>{sortKey === key ? ascending ? "↑" : "↓" : "↕"}</span></button></th>)}<th>状态</th></tr></thead>
        <tbody>{rows.map((item) => { const change = item.w2Sales * currentScale - item.w1Sales; const itemStatus = status(item, currentScale); return <tr className="clickable-row" key={item.company} tabIndex={0} aria-label={`查看${item.company}详情`} onClick={() => setSelectedCompany(item)} onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); setSelectedCompany(item); } }}>
          <td title={item.company}>{item.company}</td><td className="owner-table-cell"><span className="owner-badge" data-owner={item.serviceOwner}>{item.serviceOwner}</span></td><td>{money(item.w1Sales)}</td><td><strong>{money(item.w2Sales)}</strong></td>
          <td className={change > 0 ? "up" : change < 0 ? "down" : "flat"}>{signedMoney(change)}</td>
          <td>{percent(previousMargin(item))}</td><td>{percent(currentMargin(item))}</td><td className={companyMarginDelta(item) > 0 ? "up" : companyMarginDelta(item) < 0 ? "down" : "flat"}>{isNewCompany(item) ? "—" : signed(companyMarginDelta(item), 2)}</td>
          <td>{previousCustomerCount(item) === currentCustomerCount(item) ? currentCustomerCount(item) : `${previousCustomerCount(item)}→${currentCustomerCount(item)}`}</td><td><div className="status-stack"><span className={`status-tag status-${itemStatus}`}>{itemStatus}</span>{hasZeroMarginWithSales(item) && <span className="quality-tag">待核查</span>}</div></td>
        </tr>; })}</tbody>
      </table></div>
      {!rows.length && <div className="empty-state">没有符合当前条件的客户公司</div>}
    </section>

    {selectedCompany && <div className="company-drawer-backdrop" role="presentation" onClick={() => setSelectedCompany(null)}>
      <aside className="company-drawer" role="dialog" aria-modal="true" aria-labelledby="company-detail-title" onClick={(event) => event.stopPropagation()}>
        <div className="drawer-heading">
          <div><p>COMPANY DEEP DIVE</p><h2 id="company-detail-title">{selectedCompany.company}</h2></div>
          <button type="button" onClick={() => setSelectedCompany(null)} aria-label="关闭公司详情">×</button>
        </div>
        <div className="drawer-status-group"><span className="owner-badge" data-owner={selectedCompany.serviceOwner}>客服员：{selectedCompany.serviceOwner}</span><span className={`drawer-status status-tag status-${status(selectedCompany, currentScale)}`}>{status(selectedCompany, currentScale)}</span>{hasZeroMarginWithSales(selectedCompany) && <span className="quality-tag">销售有数据 · 毛利额为 0 · 待核查</span>}</div>
        <div className="drawer-metrics">
          <div><span>{isPartialMonth ? "本月累计销售额" : `${currentLabel}销售额`}</span><strong>{money(selectedCompany.w2Sales)}</strong></div>
          <div><span>{isPartialMonth ? "预计月底变化" : "销售额环比"}</span><strong className={selectedCompany.w2Sales * currentScale >= selectedCompany.w1Sales ? "up" : "down"}>{selectedCompany.w1Sales ? signed((selectedCompany.w2Sales * currentScale / selectedCompany.w1Sales - 1) * 100) : "新增"}</strong></div>
          <div><span>{currentLabel}毛利率</span><strong>{percent(currentMargin(selectedCompany))}</strong></div>
          <div><span>毛利率环比</span><strong className={companyMarginDelta(selectedCompany) >= 0 ? "up" : "down"}>{isNewCompany(selectedCompany) ? "—" : signed(companyMarginDelta(selectedCompany), 2)}</strong></div>
        </div>
        <div className="customer-summary"><span>{currentLabel}下属客户</span><strong>{currentCustomers.length} 家</strong><small>{previousCustomers.length === currentCustomers.length ? "客户数量保持稳定" : `${previousLabel} ${previousCustomers.length} 家 → ${currentLabel} ${currentCustomers.length} 家`}</small></div>
        <section className="customer-list-section" aria-label="下属客户经营明细">
          <div className="customer-list-heading"><div><span>客户经营明细</span><small>销售额、环比、毛利率与毛利额</small></div><b>{currentCustomers.length}</b></div>
          {customerRows.length ? <ul className="customer-detail-list">{customerRows.map((customer, index) => {
            const isAdded = customer.w1Sales <= 0 && customer.w2Sales > 0;
            const isInactive = customer.w1Sales > 0 && customer.w2Sales <= 0;
            const needsReview = hasZeroMarginWithSales(customer);
            return <li key={customer.name} className={isInactive ? "inactive" : ""}>
              <div className="customer-record-heading"><i>{String(index + 1).padStart(2, "0")}</i><span>{customer.name}</span><div className="customer-record-tags">{isAdded && <em className="added">新增</em>}{isInactive && <em className="inactive-tag">{currentLabel}未出现</em>}{needsReview && <em className="quality-tag">待核查</em>}</div></div>
              <div className="customer-record-metrics">
                <div><span>{isPartialMonth ? "本月累计销售" : `${currentLabel}销售`}</span><strong>{money(customer.w2Sales)}</strong></div>
                <div><span>{isPartialMonth ? "预计月底变化" : "销售环比"}</span><strong className={customer.w2Sales * currentScale >= customer.w1Sales ? "up" : "down"}>{isAdded ? "新增" : isInactive ? "流失" : customer.w1Sales ? signed((customer.w2Sales * currentScale / customer.w1Sales - 1) * 100) : "—"}</strong></div>
                <div><span>{currentLabel}毛利率</span><strong>{isInactive ? "—" : percent(customerCurrentMargin(customer))}</strong></div>
                <div><span>{isPartialMonth ? "本月累计毛利额" : `${currentLabel}毛利额`}</span><strong>{money(customer.w2MarginAmount)}</strong></div>
              </div>
            </li>;
          })}</ul> : <p className="customer-list-empty">没有客户销售记录</p>}
        </section>
      </aside>
    </div>}

    <footer>西安望家欢毛利环比（此网页用AI搭建部署）</footer>
  </div></main>;
}
