import React from 'react'
import { RouterProvider } from 'react-router'
import { router } from './app.routes'
import { useAuth } from './features/auth/hook/useAuth'
import { useEffect } from "react"

const App = () => {

  const auth = useAuth()

  useEffect(() => {
    console.log("App initialized. Checking for existing session...");
    const token = localStorage.getItem("token");
    console.log("Token in localStorage:", token ? "Found" : "Not Found");
    auth.handleGetMe()
  }, [])
  
  return (
    <RouterProvider router={router} />
  )
}

export default App