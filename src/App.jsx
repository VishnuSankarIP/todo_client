import { Route, Routes } from "react-router-dom"
import SignupPage from "./pages/SignupPage"
import React from "react"
import LoginPage from "./pages/LoginPage"
import Dashboard from "./pages/Dashboard"

function App() {

  return (
    <>
     <Routes>
      <Route path="/" element={<SignupPage />}></Route>
      <Route path="/login" element={<LoginPage />}></Route>
      <Route path="/dashboard" element={<Dashboard />}></Route>
     </Routes>
    </>
  )
}

export default App
