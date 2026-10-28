
import { Routes, Route } from 'react-router'
import Home from './pages/Home'
import CreateReport from './pages/CreateReport'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/create" element={<CreateReport />} />
    </Routes>
  )
}

export default App
