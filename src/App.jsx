import { Outlet } from "react-router-dom"
import Navbar from "./components/Navbar/Navbar"
import { ToastContainer } from "./components/Toast/ToastContainer"
import "./App.scss"

function App() {
  return (
    <div className="app">
      <Navbar />
      <main className="main-content">
        <Outlet />
      </main>
      <ToastContainer />
    </div>
  )
}

export default App
