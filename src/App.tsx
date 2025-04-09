
import { useState } from 'react'
import './App.css'
import { Routes,Route, Link } from 'react-router'
import Dashboard from './pages/dashboard/Dashboard'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    <Routes>
      
      <Route path="/" element={<Dashboard/>}/>


    </Routes>

    </>
  )
}

export default App
