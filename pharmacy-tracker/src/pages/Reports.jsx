import { useState } from "react";
import "../styles/Reports.css";

// ── Mock Data ────────────────────────────────────────────────────────────────
const MONTHLY_SALES = [
  { month: "Aug 2025", totalSales: 320, revenue: 48000, fastMoving: "Paracetamol 500mg", slowMoving: "Insulin Glargine" },
  { month: "Sep 2025", totalSales: 410, revenue: 61500, fastMoving: "Amoxicillin 500mg", slowMoving: "Atorvastatin 20mg" },
  { month: "Oct 2025", totalSales: 375, revenue: 56250, fastMoving: "Cetirizine 10mg", slowMoving: "Salbutamol Inhaler" },
  { month: "Nov 2025", totalSales: 490, revenue: 73500, fastMoving: "Paracetamol 500mg", slowMoving: "Omeprazole 20mg" },
  { month: "Dec 2025", totalSales: 620, revenue: 93000, fastMoving: "Amoxicillin 500mg", slowMoving: "Insulin Glargine" },
  { month: "Jan 2026", totalSales: 530, revenue: 79500, fastMoving: "Metformin 500mg", slowMoving: "Azithromycin 250mg" },
  { month: "Feb 2026", totalSales: 480, revenue: 72000, fastMoving: "Paracetamol 500mg", slowMoving: "Salbutamol Inhaler" },
];

const FAST_MOVING = [
  { drug: "Paracetamol 500mg", category: "Painkiller", unitsSold: 840, revenue: 2520 },
  { drug: "Amoxicillin 500mg", category: "Antibiotic", unitsSold: 620, revenue: 9610 },
  { drug: "Metformin 500mg", category: "Diabetes", unitsSold: 510, revenue: 4463 },
  { drug: "Cetirizine 10mg", category: "Antihistamine", unitsSold: 430, revenue: 2365 },
  { drug: "Omeprazole 20mg", category: "Gastrointestinal", unitsSold: 380, revenue: 4560 },
];

const SLOW_MOVING = [
  { drug: "Insulin Glargine", category: "Diabetes", unitsSold: 45, revenue: 5400 },
  { drug: "Salbutamol Inhaler", category: "Respiratory", unitsSold: 60, revenue: 2700 },
  { drug: "Atorvastatin 20mg", category: "Cardiovascular", unitsSold: 72, revenue: 1584 },
  { drug: "Azithromycin 250mg", category: "Antibiotic", unitsSold: 88, revenue: 1848 },
];

const BRANCH_PERFORMANCE = [
  { branch: "CBD Branch", sales: 1240, revenue: 186000, percentage: 48 },
  { branch: "Westlands Branch", sales: 820, revenue: 123000, percentage: 32 },
  { branch: "Karen Branch", sales: 510, revenue: 76500, percentage: 20 },
];

const DISPOSAL_SUMMARY = [
  { month: "Dec 2025", disposed: 12, reason: "Expired" },
  { month: "Jan 2026", disposed: 8, reason: "Damaged" },
  { month: "Feb 2026", disposed: 15, reason: "Expired" },
];

const MAX_SALES = Math.max(...MONTHLY_SALES.map(m => m.totalSales));

export default function Reports() {
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedMonth, setSelectedMonth] = useState("Feb 2026");

  const currentMonth = MONTHLY_SALES.find(m => m.month === selectedMonth) || MONTHLY_SALES[MONTHLY_SALES.length - 1];

  return (
    <div className="reports">
      {/* Header */}
      <div className="rep-header">
        <div>
          <h1 className="rep-title">Reports</h1>
          <p className="rep-sub">Monthly summaries and stock movement analytics</p>
        </div>
        <select
          className="month-select"
          value={selectedMonth}
          onChange={e => setSelectedMonth(e.target.value)}
        >
          {MONTHLY_SALES.map(m => (
            <option key={m.month} value={m.month}>{m.month}</option>
          ))}
        </select>
      </div>

      {/* Summary Cards */}
      <div className="rep-stats">
        <div className="rep-stat-card" style={{ "--accent": "#2e6da4", "--bg": "#e8f4fd" }}>
          <div className="rep-stat-icon">🛒</div>
          <div className="rep-stat-info">
            <span className="rep-stat-value">{currentMonth.totalSales}</span>
            <span className="rep-stat-label">Units Sold</span>
            <span className="rep-stat-month">{selectedMonth}</span>
          </div>
        </div>
        <div className="rep-stat-card" style={{ "--accent": "#27ae60", "--bg": "#eafaf1" }}>
          <div className="rep-stat-icon">💰</div>
          <div className="rep-stat-info">
            <span className="rep-stat-value">KES {currentMonth.revenue.toLocaleString()}</span>
            <span className="rep-stat-label">Revenue</span>
            <span className="rep-stat-month">{selectedMonth}</span>
          </div>
        </div>
        <div className="rep-stat-card" style={{ "--accent": "#e67e22", "--bg": "#fef5e7" }}>
          <div className="rep-stat-icon">🚀</div>
          <div className="rep-stat-info">
            <span className="rep-stat-value rep-stat-drug">{currentMonth.fastMoving}</span>
            <span className="rep-stat-label">Fast Moving Drug</span>
            <span className="rep-stat-month">{selectedMonth}</span>
          </div>
        </div>
        <div className="rep-stat-card" style={{ "--accent": "#95a5a6", "--bg": "#f2f3f4" }}>
          <div className="rep-stat-icon">🐢</div>
          <div className="rep-stat-info">
            <span className="rep-stat-value rep-stat-drug">{currentMonth.slowMoving}</span>
            <span className="rep-stat-label">Slow Moving Drug</span>
            <span className="rep-stat-month">{selectedMonth}</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="rep-tabs">
        {["overview", "movement", "branches", "disposal"].map(tab => (
          <button
            key={tab}
            className={`rep-tab ${activeTab === tab ? "active" : ""}`}
            onClick={() => setActiveTab(tab)}
          >
            {{ overview: "📊 Overview", movement: "💊 Drug Movement", branches: "🏥 Branches", disposal: "🗑️ Disposal" }[tab]}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === "overview" && (
        <div className="tab-content">
          <div className="rep-card">
            <h2 className="rep-card-title">📈 Monthly Sales Trend</h2>
            <div className="bar-chart">
              {MONTHLY_SALES.map((m, i) => (
                <div className="bar-col" key={i}>
                  <span className="bar-value">{m.totalSales}</span>
                  <div className="bar-wrap">
                    <div
                      className={`bar-fill ${m.month === selectedMonth ? "bar-active" : ""}`}
                      style={{ height: `${(m.totalSales / MAX_SALES) * 100}%` }}
                    />
                  </div>
                  <span className="bar-label">{m.month.split(" ")[0]}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="rep-card">
            <h2 className="rep-card-title">💰 Revenue by Month (KES)</h2>
            <table className="rep-table">
              <thead>
                <tr>
                  <th>Month</th>
                  <th>Units Sold</th>
                  <th>Revenue</th>
                  <th>Fast Moving</th>
                  <th>Slow Moving</th>
                </tr>
              </thead>
              <tbody>
                {[...MONTHLY_SALES].reverse().map((m, i) => (
                  <tr key={i} className={m.month === selectedMonth ? "row-selected" : ""}>
                    <td><strong>{m.month}</strong></td>
                    <td>{m.totalSales}</td>
                    <td>KES {m.revenue.toLocaleString()}</td>
                    <td><span className="fast-tag">{m.fastMoving}</span></td>
                    <td><span className="slow-tag">{m.slowMoving}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === "movement" && (
        <div className="tab-content">
          <div className="rep-card">
            <h2 className="rep-card-title">🚀 Fast Moving Drugs</h2>
            <table className="rep-table">
              <thead>
                <tr><th>Drug</th><th>Category</th><th>Units Sold</th><th>Revenue (KES)</th><th>Movement</th></tr>
              </thead>
              <tbody>
                {FAST_MOVING.map((d, i) => (
                  <tr key={i}>
                    <td className="rep-drug">{d.drug}</td>
                    <td><span className="category-tag">{d.category}</span></td>
                    <td><strong>{d.unitsSold}</strong></td>
                    <td>KES {d.revenue.toLocaleString()}</td>
                    <td>
                      <div className="movement-bar">
                        <div className="movement-fill fast" style={{ width: `${(d.unitsSold / 840) * 100}%` }} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="rep-card">
            <h2 className="rep-card-title">🐢 Slow Moving Drugs</h2>
            <table className="rep-table">
              <thead>
                <tr><th>Drug</th><th>Category</th><th>Units Sold</th><th>Revenue (KES)</th><th>Movement</th></tr>
              </thead>
              <tbody>
                {SLOW_MOVING.map((d, i) => (
                  <tr key={i}>
                    <td className="rep-drug">{d.drug}</td>
                    <td><span className="category-tag">{d.category}</span></td>
                    <td><strong>{d.unitsSold}</strong></td>
                    <td>KES {d.revenue.toLocaleString()}</td>
                    <td>
                      <div className="movement-bar">
                        <div className="movement-fill slow" style={{ width: `${(d.unitsSold / 840) * 100}%` }} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === "branches" && (
        <div className="tab-content">
          <div className="rep-card">
            <h2 className="rep-card-title">🏥 Branch Performance</h2>
            <div className="branch-perf-list">
              {BRANCH_PERFORMANCE.map((b, i) => (
                <div className="branch-perf-item" key={i}>
                  <div className="branch-perf-header">
                    <span className="branch-perf-name">{b.branch}</span>
                    <span className="branch-perf-revenue">KES {b.revenue.toLocaleString()}</span>
                  </div>
                  <div className="branch-perf-meta">
                    <span>{b.sales} units sold</span>
                    <span>{b.percentage}% of total</span>
                  </div>
                  <div className="branch-perf-bar">
                    <div className="branch-perf-fill" style={{ width: `${b.percentage}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === "disposal" && (
        <div className="tab-content">
          <div className="rep-card">
            <h2 className="rep-card-title">🗑️ Disposal Summary</h2>
            <table className="rep-table">
              <thead>
                <tr><th>Month</th><th>Items Disposed</th><th>Primary Reason</th></tr>
              </thead>
              <tbody>
                {DISPOSAL_SUMMARY.map((d, i) => (
                  <tr key={i}>
                    <td><strong>{d.month}</strong></td>
                    <td>{d.disposed}</td>
                    <td><span className={`dis-badge ${d.reason === "Expired" ? "badge-red" : "badge-orange"}`}>{d.reason}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}