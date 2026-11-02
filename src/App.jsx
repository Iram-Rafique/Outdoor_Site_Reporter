import { Routes, Route } from 'react-router'
import Home from './pages/Home'
import CreateReport from './pages/CreateReport'
import Reports from './pages/Reports'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/create" element={<CreateReport />} />
      <Route path="/reports" element={<Reports />} />
    </Routes>
  )
}

export default App