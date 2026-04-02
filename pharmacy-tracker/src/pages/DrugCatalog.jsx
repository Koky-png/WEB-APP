import { useState, useEffect } from "react";
import "../styles/DrugCatalog.css";

const INITIAL_DRUGS = [
  { id: 1, name: "Amoxicillin 500mg", category: "Antibiotic", reorder_level: 20, unit_price: 15.5, storage_condition: "Cool & Dry" },
  { id: 2, name: "Paracetamol 500mg", category: "Painkiller", reorder_level: 50, unit_price: 3.0, storage_condition: "Room Temperature" },
  { id: 3, name: "Metformin 500mg", category: "Diabetes", reorder_level: 30, unit_price: 8.75, storage_condition: "Room Temperature" },
  { id: 4, name: "Atorvastatin 20mg", category: "Cardiovascular", reorder_level: 15, unit_price: 22.0, storage_condition: "Cool & Dry" },
  { id: 5, name: "Cetirizine 10mg", category: "Antihistamine", reorder_level: 25, unit_price: 5.5, storage_condition: "Room Temperature" },
  { id: 6, name: "Omeprazole 20mg", category: "Gastrointestinal", reorder_level: 30, unit_price: 12.0, storage_condition: "Cool & Dry" },
  { id: 7, name: "Salbutamol Inhaler", category: "Respiratory", reorder_level: 25, unit_price: 45.0, storage_condition: "Room Temperature" },
  { id: 8, name: "Insulin Glargine", category: "Diabetes", reorder_level: 20, unit_price: 120.0, storage_condition: "Refrigerated" },
];

const CATEGORIES = ["All", "Antibiotic", "Painkiller", "Diabetes", "Cardiovascular", "Antihistamine", "Gastrointestinal", "Respiratory"];

const EMPTY_FORM = { name: "", category: "", reorder_level: "", unit_price: "", storage_condition: "" };

export default function DrugCatalog() {
  const [drugs, setDrugs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  useEffect(() => {
    // fetch drugs from db
    fetch('http://localhost/get_drugs.php')
      .then(response => response.json())
      .then(data => {
        setDrugs(data);
        setLoading(false);
      })
      .catch(error => {
        console.error("Error fetching data:", error);
        setDrugs(INITIAL_DRUGS);
        setLoading(false);
      });
  }, []);

  // ── Filtering ─────────────────────────────────────────────────────────────
  const filtered = drugs.filter(d => {
    const matchSearch = d.name.toLowerCase().includes(search.toLowerCase());
    const matchCategory = activeCategory === "All" || d.category === activeCategory;
    return matchSearch && matchCategory;
  });

  // ── Form Handling ─────────────────────────────────────────────────────────
  function handleFormChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  }

  function validate() {
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = "Drug name is required";
    if (!form.category.trim()) newErrors.category = "Category is required";
    if (!form.reorder_level || isNaN(form.reorder_level)) newErrors.reorder_level = "Valid reorder level required";
    if (!form.unit_price || isNaN(form.unit_price)) newErrors.unit_price = "Valid unit price required";
    if (!form.storage_condition.trim()) newErrors.storage_condition = "Storage condition is required";
    return newErrors;
  }

  function handleSubmit() {
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    const newDrug = {
      id: drugs.length + 1,
      name: form.name,
      category: form.category,
      reorder_level: parseInt(form.reorder_level),
      unit_price: parseFloat(form.unit_price),
      storage_condition: form.storage_condition,
    };
    setDrugs([...drugs, newDrug]);
    setForm(EMPTY_FORM);
    setShowModal(false);
  }

  function handleDelete(id) {
    setDrugs(drugs.filter(d => d.id !== id));
    setDeleteConfirm(null);
  }

  function storageBadge(condition) {
    const map = {
      "Refrigerated": "badge-blue",
      "Cool & Dry": "badge-teal",
      "Room Temperature": "badge-grey",
    };
    return map[condition] || "badge-grey";
  }

  if (loading) {
    return (
      <div className="drugcatalog">
        <div className="dc-header">
          <h1 className="dc-title">Loading drugs from database...</h1>
          <p className="dc-sub">Please wait</p>
        </div>
      </div>
    );
  }

  return (
    <div className="drugcatalog">
      {/* Header */}
      <div className="dc-header">
        <div>
          <h1 className="dc-title">Drug Catalog</h1>
          <p className="dc-sub">{drugs.length} drugs registered in the system</p>
        </div>
        <button className="add-btn" onClick={() => setShowModal(true)}>+ Add Drug</button>
      </div>

      {/* Search & Filter */}
      <div className="dc-controls">
        <input
          className="dc-search"
          type="text"
          placeholder="🔍 Search by drug name..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <div className="dc-categories">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              className={`cat-btn ${activeCategory === cat ? "active" : ""}`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="dc-table-wrap">
        <table className="dc-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Drug Name</th>
              <th>Category</th>
              <th>Reorder Level</th>
              <th>Unit Price (KES)</th>
              <th>Storage</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan="7" className="dc-empty">No drugs found matching your search.</td>
              </tr>
            ) : (
              filtered.map((drug, i) => (
                <tr key={drug.id}>
                  <td className="dc-num">{i + 1}</td>
                  <td className="dc-name">{drug.name}</td>
                  <td><span className="category-tag">{drug.category}</span></td>
                  <td>{drug.reorder_level} units</td>
                  <td>KES {drug.unit_price.toFixed(2)}</td>
                  <td><span className={`storage-badge ${storageBadge(drug.storage_condition)}`}>{drug.storage_condition}</span></td>
                  <td>
                    {deleteConfirm === drug.id ? (
                      <div className="confirm-delete">
                        <span>Sure?</span>
                        <button className="confirm-yes" onClick={() => handleDelete(drug.id)}>Yes</button>
                        <button className="confirm-no" onClick={() => setDeleteConfirm(null)}>No</button>
                      </div>
                    ) : (
                      <button className="delete-btn" onClick={() => setDeleteConfirm(drug.id)}>🗑️ Delete</button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Add Drug Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Add New Drug</h2>
              <button className="modal-close" onClick={() => setShowModal(false)}>✕</button>
            </div>

            <div className="modal-body">
              <div className="form-group">
                <label>Drug Name</label>
                <input
                  name="name"
                  value={form.name}
                  onChange={handleFormChange}
                  placeholder="e.g. Amoxicillin 500mg"
                />
                {errors.name && <span className="form-error">{errors.name}</span>}
              </div>

              <div className="form-group">
                <label>Category</label>
                <select name="category" value={form.category} onChange={handleFormChange}>
                  <option value="">-- Select Category --</option>
                  {CATEGORIES.filter(c => c !== "All").map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
                {errors.category && <span className="form-error">{errors.category}</span>}
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Reorder Level</label>
                  <input
                    name="reorder_level"
                    type="number"
                    value={form.reorder_level}
                    onChange={handleFormChange}
                    placeholder="e.g. 20"
                  />
                  {errors.reorder_level && <span className="form-error">{errors.reorder_level}</span>}
                </div>

                <div className="form-group">
                  <label>Unit Price (KES)</label>
                  <input
                    name="unit_price"
                    type="number"
                    step="0.01"
                    value={form.unit_price}
                    onChange={handleFormChange}
                    placeholder="e.g. 15.50"
                  />
                  {errors.unit_price && <span className="form-error">{errors.unit_price}</span>}
                </div>
              </div>

              <div className="form-group">
                <label>Storage Condition</label>
                <select name="storage_condition" value={form.storage_condition} onChange={handleFormChange}>
                  <option value="">-- Select Condition --</option>
                  <option value="Room Temperature">Room Temperature</option>
                  <option value="Cool & Dry">Cool & Dry</option>
                  <option value="Refrigerated">Refrigerated</option>
                </select>
                {errors.storage_condition && <span className="form-error">{errors.storage_condition}</span>}
              </div>
            </div>

            <div className="modal-footer">
              <button className="cancel-btn" onClick={() => setShowModal(false)}>Cancel</button>
              <button className="submit-btn" onClick={handleSubmit}>Add Drug</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}