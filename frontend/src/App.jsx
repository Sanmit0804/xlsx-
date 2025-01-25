import { useState } from 'react'
import './App.css'
import Dashboard from './components/dashboard'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div className="container">
        <Dashboard/>
      </div>
    </>
  )
}

export default App
