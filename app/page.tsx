"use client";

import { useMemo, useState } from "react";
import { companies, type Company } from "./data";

type Filter = "all" | "new" | "dropped" | "negative" | "down";
type SortKey = "company" | "w1Sales" | "w2Sales" | "salesPct" | "w1Margin" | "w2Margin" | "marginDelta" | "custW2";

const money = (value: number) => `¥${Math.round(value).toLocaleString("zh-CN")}`;
const percent = (value: number) => `${(value * 100).toFixed(2)}%`;
const signed = (value: number, digits = 1) => `${value > 0 ? "+" : ""}${value.toFixed(digits)}%`;
const salesPct = (item: Company) => item.w1Sales ? (item.w2Sales - item.w1Sales) / item.w1Sales : Number.POSITIVE_INFINITY;
const status = (item: Company) => item.isNew ? "新增" : item.isDropped ? "流失" : item.w2Sales < item.w1Sales ? "销售下滑" : "增长";

const metrics = [
  { label: "本周销售额", value: "¥1,659,244", change: "+12.1% 环比", tone: "up", glyph: "¥" },
  { label: "本周参考毛利额", value: "¥221,339", change: "+11.5% 环比", tone: "up", glyph: "利" },
  { label: "本周毛利率", value: "13.34%", change: "-0.07% 环比", tone: "down", glyph: "%" },
  { label: "客户公司数", value: "30", change: "+2 家 环比", tone: "up", glyph: "客" },
] as const;

const backgrounds = [
  { label: "海浪", src: "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260629_030107_874273ea-684a-4e90-bb96-8fdfde48d53d.mp4" },
  { label: "网格波", src: "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260629_032424_3c9c2a9d-807b-4482-80e6-dd6d9dfd4545.mp4" },
  { label: "光隧道", src: "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260627_094019_4214ea73-b963-46a4-8327-61489192de99.mp4" },
] as const;

const filters: { key: Filter; label: string }[] = [
  { key: "all", label: "全部" }, { key: "new", label: "新增" }, { key: "dropped", label: "流失" },
  { key: "negative", label: "负毛利" }, { key: "down", label: "下滑" },
];

function SectionTitle({ children, note }: { children: React.ReactNode; note?: string }) {
  return <div className="section-title"><span /><div><h2>{children}</h2>{note && <p>{note}</p>}</div></div>;
}

function SalesChart() {
  const rows = [...companies].sort((a, b) => b.w2Sales - a.w2Sales).slice(0, 8);
  const max = Math.max(...rows.flatMap((item) => [item.w1Sales, item.w2Sales]));
  return <div className="bar-chart sales-chart">
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

function MarginDeltaChart() {
  const rows = [...companies].sort((a, b) => Math.abs(b.marginDelta) - Math.abs(a.marginDelta)).slice(0, 8);
  const max = Math.max(...rows.map((item) => Math.abs(item.marginDelta)));
  return <div className="delta-chart">
    {rows.map((item) => <div className="delta-row" key={item.company}>
      <span title={item.company}>{item.company}</span>
      <div className="delta-track"><i className={item.marginDelta >= 0 ? "positive" : "negative"} style={{ width: `${Math.max(2, Math.abs(item.marginDelta) / max * 100)}%` }} /></div>
      <b className={item.marginDelta >= 0 ? "up" : "down"}>{signed(item.marginDelta, 2)}</b>
    </div>)}
  </div>;
}

function MarginRank({ high }: { high: boolean }) {
  const rows = [...companies].sort((a, b) => high ? b.w2Margin - a.w2Margin : a.w2Margin - b.w2Margin).slice(0, 10);
  const max = Math.max(...rows.map((item) => item.w2Margin));
  return <ol className="rank-list">
    {rows.map((item, index) => <li key={item.company}>
      <em>{index + 1}</em><span title={item.company}>{item.company}</span>
      <div><i className={high ? "rank-high" : "rank-low"} style={{ width: `${Math.max(3, item.w2Margin / max * 100)}%` }} /></div>
      <b>{percent(item.w2Margin)}</b>
    </li>)}
  </ol>;
}

export default function Home() {
  const [background, setBackground] = useState(0);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Filter>("all");
  const [sortKey, setSortKey] = useState<SortKey>("w2Sales");
  const [ascending, setAscending] = useState(false);

  const rows = useMemo(() => {
    const match = companies.filter((item) => {
      const byQuery = item.company.toLowerCase().includes(query.trim().toLowerCase());
      const byFilter = filter === "all" || (filter === "new" && item.isNew) || (filter === "dropped" && item.isDropped)
        || (filter === "negative" && item.w2Margin < 0) || (filter === "down" && item.w2Sales < item.w1Sales);
      return byQuery && byFilter;
    });
    return match.sort((a, b) => {
      const av = sortKey === "salesPct" ? salesPct(a) : a[sortKey];
      const bv = sortKey === "salesPct" ? salesPct(b) : b[sortKey];
      const result = typeof av === "string" ? av.localeCompare(String(bv), "zh-CN") : Number(av) - Number(bv);
      return ascending ? result : -result;
    });
  }, [query, filter, sortKey, ascending]);

  const sortBy = (key: SortKey) => {
    if (key === sortKey) setAscending((value) => !value);
    else { setSortKey(key); setAscending(false); }
  };

  const alerts = [
    { label: "新增公司", value: 2, detail: "631所、未央区教育局", tone: "new", action: "new" as Filter },
    { label: "流失公司", value: 0, detail: "无", tone: "drop", action: "dropped" as Filter },
    { label: "销售额下滑公司", value: 15, detail: "华润西京医院、中航电测", tone: "sales", action: "down" as Filter },
    { label: "毛利率下滑公司", value: 14, detail: "中航电测、115厂", tone: "margin", action: "all" as Filter },
  ];

  const headers: [SortKey, string][] = [
    ["company", "客户公司"], ["w1Sales", "上周销售额"], ["w2Sales", "本周销售额"], ["salesPct", "销售额环比"],
    ["w1Margin", "上周毛利率"], ["w2Margin", "本周毛利率"], ["marginDelta", "毛利率环比(%)"], ["custW2", "下属客户"],
  ];

  return <main className="dashboard-shell reference-theme">
    <div className="video-background" aria-hidden="true">
      <video key={background} autoPlay muted loop playsInline>
        <source src={backgrounds[background].src} type="video/mp4" />
      </video>
      <span />
    </div>
    <div className="dashboard-wrap">
    <header className="dashboard-header">
      <div><p className="eyebrow">AI-POWERED SALES INTELLIGENCE</p><h1>客户公司销售 · 双周环比看板</h1><p className="subtitle">按「客户公司」维度汇总 · 销售额与毛利率环比 · 点击公司行可下钻下属客户</p></div>
      <div className="header-controls">
        <div className="period-chip"><span>对比周期</span><strong>08-07 ~ 08-13</strong><i>→</i><strong>08-14 ~ 08-20</strong></div>
        <div className="background-switcher" aria-label="切换动态背景">
          {backgrounds.map((item, index) => <button type="button" key={item.label} className={background === index ? "active" : ""} onClick={() => setBackground(index)} aria-label={`切换背景：${item.label}`}><b>0{index + 1}</b><span>/ {item.label}</span></button>)}
        </div>
      </div>
    </header>

    <section className="metric-grid" aria-label="核心指标">{metrics.map((metric, index) => <article className="metric-card" key={metric.label}>
      <div className={`metric-icon icon-${index + 1}`} aria-hidden="true">{metric.glyph}</div><p>{metric.label}</p><strong>{metric.value}</strong><span className={metric.tone}>{metric.change}</span>
    </article>)}</section>

    <section className="alert-grid" aria-label="经营提醒">{alerts.map((alert) => <button type="button" className={`alert-card alert-${alert.tone}`} key={alert.label} onClick={() => setFilter(alert.action)}>
      <p>{alert.label}</p><strong>{alert.value}</strong><span>{alert.detail}</span>
    </button>)}</section>

    <section className="content-section">
      <SectionTitle note="销售规模、毛利率波动与高低位公司一屏对比">公司销售与毛利率可视化</SectionTitle>
      <div className="chart-grid">
        <article className="chart-card chart-wide"><div className="chart-heading"><h3>销售额 TOP 8</h3><div className="legend"><span><i className="old" />上周</span><span><i className="current" />本周</span></div></div><SalesChart /></article>
        <article className="chart-card"><div className="chart-heading"><h3>毛利率波动聚焦</h3><small>百分点</small></div><MarginDeltaChart /></article>
        <article className="chart-card"><div className="chart-heading"><h3>本周毛利率最高 Top 10</h3><small className="rank-green">高位</small></div><MarginRank high /></article>
        <article className="chart-card"><div className="chart-heading"><h3>本周毛利率最低 Top 10</h3><small className="rank-red">低位</small></div><MarginRank high={false} /></article>
      </div>
    </section>

    <section className="content-section table-section">
      <SectionTitle note="点击表头可排序，使用状态标签快速聚焦异常公司">客户公司汇总明细</SectionTitle>
      <div className="toolbar">
        <label className="search-box"><span aria-hidden="true">⌕</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="搜索客户公司…" aria-label="搜索客户公司" /></label>
        <div className="pills">{filters.map((item) => <button type="button" key={item.key} className={filter === item.key ? "active" : ""} onClick={() => setFilter(item.key)}>{item.label}</button>)}</div>
        <span className="row-count">共 {rows.length} 家公司</span>
      </div>
      <div className="table-scroll"><table><thead><tr>{headers.map(([key, label]) => <th key={key}><button type="button" onClick={() => sortBy(key)}>{label}<span>{sortKey === key ? ascending ? "↑" : "↓" : "↕"}</span></button></th>)}<th>状态</th></tr></thead>
        <tbody>{rows.map((item) => { const change = salesPct(item); const itemStatus = status(item); return <tr className="clickable-row" key={item.company} tabIndex={0} aria-label={`查看${item.company}详情`} onClick={() => setSelectedCompany(item)} onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); setSelectedCompany(item); } }}>
          <td title={item.company}>{item.company}</td><td>{money(item.w1Sales)}</td><td><strong>{money(item.w2Sales)}</strong></td>
          <td className={change > 0 ? "up" : change < 0 ? "down" : "flat"}>{Number.isFinite(change) ? signed(change * 100) : "—"}</td>
          <td>{percent(item.w1Margin)}</td><td>{percent(item.w2Margin)}</td><td className={item.marginDelta > 0 ? "up" : item.marginDelta < 0 ? "down" : "flat"}>{item.isNew ? "—" : signed(item.marginDelta, 2)}</td>
          <td>{item.custW1 === item.custW2 ? item.custW2 : `${item.custW1}→${item.custW2}`}</td><td><span className={`status-tag status-${itemStatus}`}>{itemStatus}</span></td>
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
        <span className={`drawer-status status-tag status-${status(selectedCompany)}`}>{status(selectedCompany)}</span>
        <div className="drawer-metrics">
          <div><span>本周销售额</span><strong>{money(selectedCompany.w2Sales)}</strong></div>
          <div><span>销售额环比</span><strong className={salesPct(selectedCompany) >= 0 ? "up" : "down"}>{Number.isFinite(salesPct(selectedCompany)) ? signed(salesPct(selectedCompany) * 100) : "新增"}</strong></div>
          <div><span>本周毛利率</span><strong>{percent(selectedCompany.w2Margin)}</strong></div>
          <div><span>毛利率环比</span><strong className={selectedCompany.marginDelta >= 0 ? "up" : "down"}>{selectedCompany.isNew ? "—" : signed(selectedCompany.marginDelta, 2)}</strong></div>
        </div>
        <div className="customer-summary"><span>本周下属客户</span><strong>{selectedCompany.custW2} 家</strong><small>{selectedCompany.custW1 === selectedCompany.custW2 ? "客户数量保持稳定" : `上周 ${selectedCompany.custW1} 家 → 本周 ${selectedCompany.custW2} 家`}</small></div>
      </aside>
    </div>}

    <footer>数据已内嵌于本页 · 离线可用（视频需联网，加载失败时自动回退黑底）</footer>
  </div></main>;
}
