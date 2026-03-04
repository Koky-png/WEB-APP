import { useState } from "react";
import "../styles/Inventory.css";

const INVENTORY = [
  { id: 1, drug: "Amoxicillin 500mg", category: "Antibiotic", batch: "BCH-0021", branch: "CBD Branch", qty: 40, reorder: 20, location: "Shelf B1", status: "Available", expiry: "2026-03-28" },
  { id: 2, drug: "Paracetamol 500mg", category: "Painkiller", batch: "BCH-0034", branch: "Westlands Branch", qty: 200, reorder: 50, location: "Shelf A2", status: "Available", expiry: "2027-10-01" },
  { id: 3, drug: "Metformin 500mg", category: "Diabetes", batch: "BCH-0019", branch: "CBD Branch", qty: 9, reorder: 30, location: "Shelf C3", status: "Available", expiry: "2026-04-02" },
  { id: 4, drug: "Atorvastatin 20mg", category: "Cardiovascular", batch: "BCH-0055", branch: "Karen Branch", qty: 25, reorder: 15, location: "Shelf D1", status: "Available", expiry: "2026-04-05" },
  { id: 5, drug: "Cetirizine 10mg", category: "Antihistamine", batch: "BCH-0061", branch: "Westlands Branch", qty: 80, reorder: 25, location: "Shelf A3", status: "Available", expiry: "2026-04-08" },
  { id: 6, drug: "Insulin Glargine", category: "Diabetes", batch: "BCH-0089", branch: "Karen Branch", qty: 4, reorder: 20, location: "Fridge 1", status: "Available", expiry: "2027-05-01" },
  { id: 7, drug: "Salbutamol Inhaler", category: "Respiratory", batch: "BCH-0072", branch: "CBD Branch", qty: 6, reorder: 25, location: "Shelf E2", status: "Available", expiry: "2027-03-01" },
  { id: 8, drug: "Omeprazole 20mg", category: "Gastrointestinal", batch: "BCH-0043", branch: "Westlands Branch", qty: 0, reorder: 30, location: "Shelf B3", status: "OutOfStock", expiry: "2027-08-01" },
  { id: 9, drug: "Azithromycin 250mg", category: "Antibiotic", batch: "BCH-0011", branch: "Karen Branch", qty: 3, reorder: 15, location: "Shelf B2", status: "Available", expiry: "2026-06-01" },
  { id: 10, drug: "Paracetamol 500mg", category: "Painkiller", batch: "BCH-0098", branch: "CBD Branch", qty: 150, reorder: 50, location: "Shelf A1", status: "Available", expiry: "2028-01-01" },
];

const BRANCHES = ["All Branches", "CBD Branch", "Westlands Branch", "Karen Branch"];
const STATUSES = ["All", "Available", "Low Stock", "OutOfStock"];

function stockStatus(qty, reorder) {
  if (qty === 0) return "OutOfStock";
  if (qty < reorder) return "Low Stock";
  return "Available";
}

function statusBadge(status) {
  const map = {
    "Available": "badge-green",
    "Low Stock": "badge-orange",
    "OutOfStock": "badge-red",
    "Expired": "badge-grey",
  };
  return map[status] || "badge-grey";
}

export default function Inventory() {
  const [search, setSearch] = useState("");
  const [branch, setBranch] = useState("All Branches");
  const [statusFilter, setStatusFilter] = useState("All");

  const enriched = INVENTORY.map(item => ({
    ...item,
    computedStatus: stockStatus(item.qty, item.reorder),
  }));

  const filtered = enriched.filter(item => {
    const matchSearch =
      item.drug.toLowerCase().includes(search.toLowerCase()) ||
      item.batch.toLowerCase().includes(search.toLowerCase());
    const matchBranch = branch === "All Branches" || item.branch === branch;
    const matchStatus = statusFilter === "All" || item.computedStatus === statusFilter;
    return matchSearch && matchBranch && matchStatus;
  });

  // Summary counts
  const total = enriched.length;
  const available = enriched.filter(i => i.computedStatus === "Available").length;
  const lowStock = enriched.filter(i => i.computedStatus === "Low Stock").length;
  const outOfStock = enriched.filter(i => i.computedStatus === "OutOfStock").length;

  return (
    <div className="inventory">
      {/* Header */}
      <div className="inv-header">
        <div>
          <h1 className="inv-title">Inventory</h1>
          <p className="inv-sub">Current stock levels across all branches</p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="inv-stats">
        <div className="inv-stat-card" style={{ "--accent": "#2e6da4", "--bg": "#e8f4fd" }}>
          <div className="inv-stat-icon">📦</div>
          <div className="inv-stat-info">
            <span className="inv-stat-value">{total}</span>
            <span className="inv-stat-label">Total Batches</span>
          </div>
        </div>
        <div className="inv-stat-card" style={{ "--accent": "#27ae60", "--bg": "#eafaf1" }}>
          <div className="inv-stat-icon">✅</div>
          <div className="inv-stat-info">
            <span className="inv-stat-value">{available}</span>
            <span className="inv-stat-label">Available</span>
          </div>
        </div>
        <div className="inv-stat-card" style={{ "--accent": "#e67e22", "--bg": "#fef5e7" }}>
          <div className="inv-stat-icon">⚠️</div>
          <div className="inv-stat-info">
            <span className="inv-stat-value">{lowStock}</span>
            <span className="inv-stat-label">Low Stock</span>
          </div>
        </div>
        <div className="inv-stat-card" style={{ "--accent": "#e74c3c", "--bg": "#fdedec" }}>
          <div className="inv-stat-icon">❌</div>
          <div className="inv-stat-info">
            <span className="inv-stat-value">{outOfStock}</span>
            <span className="inv-stat-label">Out of Stock</span>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="inv-controls">
        <input
          className="inv-search"
          type="text"
          placeholder="🔍 Search drug or batch number..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <div className="inv-filters">
          <div className="filter-group">
            <label>Branch</label>
            <select value={branch} onChange={e => setBranch(e.target.value)}>
              {BRANCHES.map(b => <option key={b} value={b}>{b}</option>)}
            </select>
          </div>
          <div className="filter-group">
            <label>Status</label>
            <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
              {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="inv-table-wrap">
        <table className="inv-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Drug Name</th>
              <th>Category</th>
              <th>Batch No.</th>
              <th>Branch</th>
              <th>Location</th>
              <th>Qty Available</th>
              <th>Reorder Level</th>
              <th>Expiry</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan="10" className="inv-empty">No inventory records found.</td>
              </tr>
            ) : (
              filtered.map((item, i) => (
                <tr
                  key={item.id}
                  className={item.computedStatus === "Low Stock" ? "row-warning" : item.computedStatus === "OutOfStock" ? "row-danger" : ""}
                >
                  <td className="inv-num">{i + 1}</td>
                  <td className="inv-drug">{item.drug}</td>
                  <td><span className="category-tag">{item.category}</span></td>
                  <td className="mono">{item.batch}</td>
                  <td>{item.branch}</td>
                  <td>{item.location}</td>
                  <td>
                    <span className={item.qty < item.reorder ? "qty-low" : "qty-ok"}>
                      {item.qty}
                    </span>
                  </td>
                  <td>{item.reorder}</td>
                  <td>{item.expiry}</td>
                  <td>
                    <span className={`inv-badge ${statusBadge(item.computedStatus)}`}>
                      {item.computedStatus}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <p className="inv-count">Showing {filtered.length} of {total} records</p>
    </div>
  );
}