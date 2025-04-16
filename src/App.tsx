
import './App.css'
import { Routes,Route } from 'react-router'
import Dashboard from './pages/dashboard/Dashboard'

function App() {

  return (
    <>
    <Routes>
      
      <Route path="/" element={<Dashboard/>}/>


    </Routes>

    </>
  )
}

export default App
