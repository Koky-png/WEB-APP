import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import DrugCatalog from './pages/DrugCatalog'
import StockIn from './pages/StockIn'
import Inventory from './pages/Inventory'
import Disposal from './pages/Disposal'
import Reports from './pages/Reports'
import Layout from './components/Layout'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route path="/" element={<Layout />}>
          <Route index element={<Navigate to="/dashboard" />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="drugs" element={<DrugCatalog />} />
          <Route path="stock-in" element={<StockIn />} />
          <Route path="inventory" element={<Inventory />} />
          <Route path="disposal" element={<Disposal />} />
          <Route path="reports" element={<Reports />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App