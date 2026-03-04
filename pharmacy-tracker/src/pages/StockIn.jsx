import { useState } from "react";
import "../styles/StockIn.css";

const DRUGS = [
  "Amoxicillin 500mg",
  "Paracetamol 500mg",
  "Metformin 500mg",
  "Atorvastatin 20mg",
  "Cetirizine 10mg",
  "Omeprazole 20mg",
  "Salbutamol Inhaler",
  "Insulin Glargine",
];

const BRANCHES = ["CBD Branch", "Westlands Branch", "Karen Branch"];

const INITIAL_BATCHES = [
  { id: 1, drug: "Paracetamol 500mg", batch: "BCH-0034", qty: 200, manufacture: "2025-10-01", expiry: "2027-10-01", location: "Shelf A2", branch: "CBD Branch", received: "2026-02-10" },
  { id: 2, drug: "Amoxicillin 500mg", batch: "BCH-0021", qty: 150, manufacture: "2025-08-15", expiry: "2026-03-28", location: "Shelf B1", branch: "Westlands Branch", received: "2026-01-20" },
  { id: 3, drug: "Insulin Glargine", batch: "BCH-0089", qty: 50, manufacture: "2025-11-01", expiry: "2027-05-01", location: "Fridge 1", branch: "Karen Branch", received: "2026-02-28" },
  { id: 4, drug: "Metformin 500mg", batch: "BCH-0019", qty: 300, manufacture: "2025-07-20", expiry: "2026-04-02", location: "Shelf C3", branch: "CBD Branch", received: "2026-01-15" },
];

const EMPTY_FORM = {
  drug: "",
  batch: "",
  qty: "",
  manufacture: "",
  expiry: "",
  location: "",
  branch: "",
};

function daysUntil(dateStr) {
  return Math.ceil((new Date(dateStr) - new Date()) / (1000 * 60 * 60 * 24));
}

function expiryStatus(dateStr) {
  const days = daysUntil(dateStr);
  if (days < 0) return { label: "Expired", cls: "badge-red" };
  if (days <= 30) return { label: `${days}d left`, cls: "badge-orange" };
  if (days <= 90) return { label: `${days}d left`, cls: "badge-yellow" };
  return { label: "Good", cls: "badge-green" };
}

function generateBatchNumber() {
  const num = Math.floor(Math.random() * 9000) + 1000;
  return `BCH-${num}`;
}

export default function StockIn() {
  const [batches, setBatches] = useState(INITIAL_BATCHES);
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);
  const [search, setSearch] = useState("");

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  }

  function generateBatch() {
    setForm({ ...form, batch: generateBatchNumber() });
  }

  function validate() {
    const e = {};
    if (!form.drug) e.drug = "Please select a drug";
    if (!form.batch.trim()) e.batch = "Batch number is required";
    if (!form.qty || isNaN(form.qty) || form.qty <= 0) e.qty = "Valid quantity required";
    if (!form.manufacture) e.manufacture = "Manufacture date is required";
    if (!form.expiry) e.expiry = "Expiry date is required";
    if (form.manufacture && form.expiry && form.expiry <= form.manufacture)
      e.expiry = "Expiry must be after manufacture date";
    if (!form.location.trim()) e.location = "Storage location is required";
    if (!form.branch) e.branch = "Please select a branch";
    return e;
  }

  function handleSubmit(e) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }

    const newBatch = {
      id: batches.length + 1,
      drug: form.drug,
      batch: form.batch,
      qty: parseInt(form.qty),
      manufacture: form.manufacture,
      expiry: form.expiry,
      location: form.location,
      branch: form.branch,
      received: new Date().toISOString().split("T")[0],
    };

    setBatches([newBatch, ...batches]);
    setForm(EMPTY_FORM);
    setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);
  }

  const filtered = batches.filter(b =>
    b.drug.toLowerCase().includes(search.toLowerCase()) ||
    b.batch.toLowerCase().includes(search.toLowerCase())
  );

  // FEFO: find earliest expiry per drug
  const fefoMap = {};
  batches.forEach(b => {
    if (!fefoMap[b.drug] || b.expiry < fefoMap[b.drug]) {
      fefoMap[b.drug] = b.expiry;
    }
  });

  return (
    <div className="stockin">
      {/* Header */}
      <div className="si-header">
        <div>
          <h1 className="si-title">Stock In</h1>
          <p className="si-sub">Record new drug batches received at the pharmacy</p>
        </div>
      </div>

      {/* Success Banner */}
      {success && (
        <div className="si-success">
          Batch added successfully! Stock has been updated.
        </div>
      )}

      {/* Form Card */}
      <div className="si-form-card">
        <h2 className="si-form-title"> Add New Batch</h2>
        <form onSubmit={handleSubmit} className="si-form">

          <div className="form-row">
            <div className="form-group">
              <label>Drug Name *</label>
              <select name="drug" value={form.drug} onChange={handleChange}>
                <option value="">-- Select Drug --</option>
                {DRUGS.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
              {errors.drug && <span className="form-error">{errors.drug}</span>}
            </div>

            <div className="form-group">
              <label>Batch Number *</label>
              <div className="batch-input-wrap">
                <input
                  name="batch"
                  value={form.batch}
                  onChange={handleChange}
                  placeholder="e.g. BCH-0034"
                />
                <button type="button" className="generate-btn" onClick={generateBatch}>
                  Auto
                </button>
              </div>
              {errors.batch && <span className="form-error">{errors.batch}</span>}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Quantity Received *</label>
              <input
                name="qty"
                type="number"
                value={form.qty}
                onChange={handleChange}
                placeholder="e.g. 200"
              />
              {errors.qty && <span className="form-error">{errors.qty}</span>}
            </div>

            <div className="form-group">
              <label>Branch *</label>
              <select name="branch" value={form.branch} onChange={handleChange}>
                <option value="">-- Select Branch --</option>
                {BRANCHES.map(b => <option key={b} value={b}>{b}</option>)}
              </select>
              {errors.branch && <span className="form-error">{errors.branch}</span>}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Manufacture Date *</label>
              <input
                name="manufacture"
                type="date"
                value={form.manufacture}
                onChange={handleChange}
              />
              {errors.manufacture && <span className="form-error">{errors.manufacture}</span>}
            </div>

            <div className="form-group">
              <label>Expiry Date *</label>
              <input
                name="expiry"
                type="date"
                value={form.expiry}
                onChange={handleChange}
              />
              {errors.expiry && <span className="form-error">{errors.expiry}</span>}
            </div>
          </div>

          <div className="form-group">
            <label>Storage Location (Shelf/Bin) *</label>
            <input
              name="location"
              value={form.location}
              onChange={handleChange}
              placeholder="e.g. Shelf A2, Fridge 1"
            />
            {errors.location && <span className="form-error">{errors.location}</span>}
          </div>

          <div className="si-form-footer">
            <button type="button" className="reset-btn" onClick={() => { setForm(EMPTY_FORM); setErrors({}); }}>
              Reset
            </button>
            <button type="submit" className="submit-btn">
              Add to Stock
            </button>
          </div>
        </form>
      </div>

      {/* Recent Batches Table */}
      <div className="si-table-card">
        <div className="si-table-header">
          <h2 className="si-form-title"> Recent Batches</h2>
          <input
            className="si-search"
            type="text"
            placeholder=" Search drug or batch..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        <div className="si-table-wrap">
          <table className="si-table">
            <thead>
              <tr>
                <th>Drug</th>
                <th>Batch No.</th>
                <th>Qty</th>
                <th>Branch</th>
                <th>Location</th>
                <th>Manufacture</th>
                <th>Expiry</th>
                <th>Status</th>
                <th>FEFO</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan="9" className="si-empty">No batches found.</td>
                </tr>
              ) : (
                filtered.map(b => {
                  const status = expiryStatus(b.expiry);
                  const isFefo = fefoMap[b.drug] === b.expiry;
                  return (
                    <tr key={b.id}>
                      <td className="si-drug">{b.drug}</td>
                      <td className="mono">{b.batch}</td>
                      <td>{b.qty}</td>
                      <td>{b.branch}</td>
                      <td>{b.location}</td>
                      <td>{b.manufacture}</td>
                      <td>{b.expiry}</td>
                      <td><span className={`si-badge ${status.cls}`}>{status.label}</span></td>
                      <td>
                        {isFefo && <span className="fefo-tag">⚡ FEFO</span>}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}