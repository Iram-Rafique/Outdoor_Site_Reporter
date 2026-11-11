import { Routes, Route } from 'react-router'
import Home from './pages/Home'
import CreateReport from './pages/CreateReport'
import Reports from './pages/Reports'
import EditReport from './pages/EditReport'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/create" element={<CreateReport />} />
      <Route path="/reports" element={<Reports />} />
      <Route path="/reports/:id/edit" element={<EditReport />} />
    </Routes>
  )
}

export default App
