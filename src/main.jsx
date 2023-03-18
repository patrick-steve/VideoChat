import './index.css'

import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'

import App from './App'
import CallPage from './components/callPage'
import Login from './components/login'
import Signup from './components/signup'
import CallUserPage from './components/callUser'

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />
  },
  {
    path: '/call',
    element: <CallPage />
  },
  {
    path: '/login',
    element: <Login />
  },
  {
    path: '/signup',
    element: <Signup />
  },
  {
    path: '/callUser',
    element: <CallUserPage />
  }
])

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router}/>
  </React.StrictMode>,
)
