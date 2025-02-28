import { useState } from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
// import './App.css'
import Login from './components/login';

function App() {
  const [count, setCount] = useState(0)

  return (
    <Router
    future={{
      v7_startTransition: true,
      v7_relativeSplatPath: true,
    }}>
      <div className="App">
        <div className="content">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Login />} />
            </Routes>
        </div>
      </div>
    </Router>
  )
}

export default App
