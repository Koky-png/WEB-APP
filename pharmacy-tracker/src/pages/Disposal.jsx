import { useState } from "react";
import "../styles/Disposal.css";

const EXPIRED_DRUGS = [
  { id: 1, drug: "Aspirin 75mg", batch: "BCH-0005", branch: "CBD Branch", qty: 120, expiry: "2026-02-15", location: "Shelf A1" },
  { id: 2, drug: "Ibuprofen 400mg", batch: "BCH-0008", branch: "Westlands Branch", qty: 60, expiry: "2026-02-28", location: "Shelf B2" },
  { id: 3, drug: "Amoxicillin 500mg", batch: "BCH-0021", branch: "CBD Branch", qty: 40, expiry: "2026-03-04", location: "Shelf B1" },
];

const INITIAL_HISTORY = [
  { id: 1, drug: "Paracetamol 1000mg", batch: "BCH-0002", branch: "Karen Branch", qty: 80, reason: "Expired", disposed_by: "Sovereign W.", date: "2026-02-20", notes: "Past expiry by 2 weeks" },
  { id: 2, drug: "Metformin 850mg", batch: "BCH-0007", branch: "CBD Branch", qty: 30, reason: "Damaged", disposed_by: "Kelly W.", date: "2026-02-18", notes: "Water damage in storage" },
  { id: 3, drug: "Cetirizine 5mg", batch: "BCH-0003", branch: "Westlands Branch", qty: 50, reason: "Returned to Supplier", disposed_by: "Bruce K.", date: "2026-02-10", notes: "Wrong batch delivered" },
];

const BRANCHES = ["CBD Branch", "Westlands Branch", "Karen Branch"];
const REASONS = ["Expired", "Damaged", "Returned to Supplier", "Recalled"];

const EMPTY_FORM = { drug: "", batch: "", branch: "", qty: "", reason: "", disposed_by: "", notes: "" };

function reasonBadge(reason) {
  const map = {
    "Expired": "badge-red",
    "Damaged": "badge-orange",
    "Returned to Supplier": "badge-blue",
    "Recalled": "badge-purple",
  };
  return map[reason] || "badge-grey";
}

function daysSince(dateStr) {
  return Math.floor((new Date() - new Date(dateStr)) / (1000 * 60 * 60 * 24));
}

export default function Disposal() {
  const [history, setHistory] = useState(INITIAL_HISTORY);
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);
  const [dismissed, setDismissed] = useState([]);

  const activeAlerts = EXPIRED_DRUGS.filter(d => !dismissed.includes(d.id));

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  }

  function fillFromAlert(drug) {
    setForm({
      ...EMPTY_FORM,
      drug: drug.drug,
      batch: drug.batch,
      branch: drug.branch,
      qty: drug.qty,
      reason: "Expired",
    });
    window.scrollTo({ top: 400, behavior: "smooth" });
  }

  function validate() {
    const e = {};
    if (!form.drug.trim()) e.drug = "Drug name is required";
    if (!form.batch.trim()) e.batch = "Batch number is required";
    if (!form.branch) e.branch = "Branch is required";
    if (!form.qty || isNaN(form.qty) || form.qty <= 0) e.qty = "Valid quantity required";
    if (!form.reason) e.reason = "Reason is required";
    if (!form.disposed_by.trim()) e.disposed_by = "Staff name is required";
    return e;
  }

  function handleSubmit(e) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }

    const newDisposal = {
      id: history.length + 1,
      drug: form.drug,
      batch: form.batch,
      branch: form.branch,
      qty: parseInt(form.qty),
      reason: form.reason,
      disposed_by: form.disposed_by,
      date: new Date().toISOString().split("T")[0],
      notes: form.notes,
    };

    setHistory([newDisposal, ...history]);
    // Dismiss alert if it was an expired drug
    const match = EXPIRED_DRUGS.find(d => d.batch === form.batch);
    if (match) setDismissed([...dismissed, match.id]);
    setForm(EMPTY_FORM);
    setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);
  }

  return (
    <div className="disposal">
      {/* Header */}
      <div className="dis-header">
        <div>
          <h1 className="dis-title">Disposal</h1>
          <p className="dis-sub">Log and track disposal of expired or damaged drugs</p>
        </div>
        <div className="dis-stat">
          <span className="dis-stat-num">{history.length}</span>
          <span className="dis-stat-label">Total Disposals</span>
        </div>
      </div>

      {/* Success Banner */}
      {success && (
        <div className="dis-success">
          ✅ Disposal logged successfully. Stock has been updated.
        </div>
      )}

      {/* Expired Alerts */}
      {activeAlerts.length > 0 && (
        <div className="alert-card">
          <div className="alert-card-header">
            <h2>⚠️ Drugs Requiring Immediate Disposal</h2>
            <span className="alert-count">{activeAlerts.length} alert{activeAlerts.length > 1 ? "s" : ""}</span>
          </div>
          <div className="alert-list">
            {activeAlerts.map(drug => (
              <div className="alert-item" key={drug.id}>
                <div className="alert-info">
                  <span className="alert-drug">{drug.drug}</span>
                  <span className="alert-meta">{drug.batch} · {drug.branch} · {drug.location}</span>
                  <span className="alert-expiry">Expired: {drug.expiry} ({daysSince(drug.expiry)} days ago)</span>
                </div>
                <div className="alert-qty">
                  <span>{drug.qty} units</span>
                </div>
                <div className="alert-actions">
                  <button className="dispose-now-btn" onClick={() => fillFromAlert(drug)}>
                    🗑️ Dispose Now
                  </button>
                  <button className="dismiss-btn" onClick={() => setDismissed([...dismissed, drug.id])}>
                    Dismiss
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Disposal Form */}
      <div className="dis-form-card">
        <h2 className="dis-form-title">🗑️ Log New Disposal</h2>
        <form onSubmit={handleSubmit} className="dis-form">

          <div className="form-row">
            <div className="form-group">
              <label>Drug Name *</label>
              <input
                name="drug"
                value={form.drug}
                onChange={handleChange}
                placeholder="e.g. Aspirin 75mg"
              />
              {errors.drug && <span className="form-error">{errors.drug}</span>}
            </div>
            <div className="form-group">
              <label>Batch Number *</label>
              <input
                name="batch"
                value={form.batch}
                onChange={handleChange}
                placeholder="e.g. BCH-0005"
              />
              {errors.batch && <span className="form-error">{errors.batch}</span>}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Branch *</label>
              <select name="branch" value={form.branch} onChange={handleChange}>
                <option value="">-- Select Branch --</option>
                {BRANCHES.map(b => <option key={b} value={b}>{b}</option>)}
              </select>
              {errors.branch && <span className="form-error">{errors.branch}</span>}
            </div>
            <div className="form-group">
              <label>Quantity to Dispose *</label>
              <input
                name="qty"
                type="number"
                value={form.qty}
                onChange={handleChange}
                placeholder="e.g. 120"
              />
              {errors.qty && <span className="form-error">{errors.qty}</span>}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Reason *</label>
              <select name="reason" value={form.reason} onChange={handleChange}>
                <option value="">-- Select Reason --</option>
                {REASONS.map(r => <option key={r} value={r}>{r}</option>)}
              </select>
              {errors.reason && <span className="form-error">{errors.reason}</span>}
            </div>
            <div className="form-group">
              <label>Disposed By *</label>
              <input
                name="disposed_by"
                value={form.disposed_by}
                onChange={handleChange}
                placeholder="e.g. Kelly W."
              />
              {errors.disposed_by && <span className="form-error">{errors.disposed_by}</span>}
            </div>
          </div>

          <div className="form-group">
            <label>Notes (Optional)</label>
            <textarea
              name="notes"
              value={form.notes}
              onChange={handleChange}
              placeholder="Any additional notes about this disposal..."
              rows={3}
            />
          </div>

          <div className="dis-form-footer">
            <button type="button" className="reset-btn" onClick={() => { setForm(EMPTY_FORM); setErrors({}); }}>
              Reset
            </button>
            <button type="submit" className="submit-btn">
              🗑️ Log Disposal
            </button>
          </div>
        </form>
      </div>

      {/* Disposal History */}
      <div className="dis-table-card">
        <h2 className="dis-form-title">📋 Disposal History</h2>
        <div className="dis-table-wrap">
          <table className="dis-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Drug</th>
                <th>Batch</th>
                <th>Branch</th>
                <th>Qty</th>
                <th>Reason</th>
                <th>Disposed By</th>
                <th>Date</th>
                <th>Notes</th>
              </tr>
            </thead>
            <tbody>
              {history.map((item, i) => (
                <tr key={item.id}>
                  <td className="dis-num">{i + 1}</td>
                  <td className="dis-drug">{item.drug}</td>
                  <td className="mono">{item.batch}</td>
                  <td>{item.branch}</td>
                  <td>{item.qty}</td>
                  <td><span className={`dis-badge ${reasonBadge(item.reason)}`}>{item.reason}</span></td>
                  <td>{item.disposed_by}</td>
                  <td>{item.date}</td>
                  <td className="dis-notes">{item.notes || "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}