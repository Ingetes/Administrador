import React from 'react'
import { createRoot } from 'react-dom/client'
import IngetesAdmin from './IngetesAdmin.jsx'   // <— Import default, sin llaves
import './index.css'

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <IngetesAdmin />
  </React.StrictMode>
)
