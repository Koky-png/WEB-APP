import { useState } from "react";
import { 
  FiBox, 
  FiAlertTriangle, 
  FiActivity, 
  FiArrowUpRight, 
  FiPlus 
} from "react-icons/fi"; 
import "../styles/Dashboard.css";

export default function Dashboard() {
  // Mock data - in a real app, these would come from Firestore/API
  const stats = [
    { id: 1, label: "Total Drugs", value: "1,240", icon: <FiBox />, color: "blue" },
    { id: 2, label: "Low Stock", value: "12", icon: <FiAlertTriangle />, color: "orange" },
    { id: 3, label: "Expired Items", value: "5", icon: <FiActivity />, color: "red" },
    { id: 4, label: "Stock Value", value: "KES 450k", icon: <FiArrowUpRight />, color: "green" },
  ];

  const lowStockItems = [
    { id: 1, name: "Amoxicillin 500mg", category: "Antibiotic", stock: 5, min: 20 },
    { id: 2, name: "Paracetamol Syrup", category: "Analgesic", stock: 8, min: 15 },
    { id: 3, name: "Panadol Advance", category: "Analgesic", stock: 2, min: 50 },
  ];

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div>
          <h1>Inventory Overview</h1>
          <p>Welcome back, here is what's happening today.</p>
        </div>
        <button className="add-btn">
          <FiPlus /> Add New Stock
        </button>
      </header>

      {/* Stats Grid */}
      <div className="stats-grid">
        {stats.map((stat) => (
          <div key={stat.id} className={`stat-card ${stat.color}`}>
            <div className="stat-icon">{stat.icon}</div>
            <div className="stat-info">
              <h3>{stat.value}</h3>
              <p>{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="dashboard-content">
        {/* Low Stock Table */}
        <div className="table-container">
          <div className="table-header">
            <h3>Low Stock Alerts</h3>
            <span className="badge-warning">{lowStockItems.length} items needing restock</span>
          </div>
          <table className="dashboard-table">
            <thead>
              <tr>
                <th>Drug Name</th>
                <th>Category</th>
                <th>Current Stock</th>
                <th>Threshold</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {lowStockItems.map((item) => (
                <tr key={item.id}>
                  <td><strong>{item.name}</strong></td>
                  <td>{item.category}</td>
                  <td>{item.stock}</td>
                  <td>{item.min}</td>
                  <td>
                    <span className="status-critical">Critical</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Quick Actions/Recent Activity Section */}
        <div className="activity-panel">
          <h3>Recent Activity</h3>
          <div className="activity-list">
            <div className="activity-item">
              <div className="dot green"></div>
              <p><strong>Stock In:</strong> 50 units of Insulin (CBD Branch)</p>
              <span>2 mins ago</span>
            </div>
            <div className="activity-item">
              <div className="dot red"></div>
              <p><strong>Disposal:</strong> 10 units Expired Aspirin</p>
              <span>1 hour ago</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}