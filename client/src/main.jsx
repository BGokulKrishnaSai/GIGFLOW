import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'          // ← App already has Router
import './index.css'
import { Provider } from 'react-redux'
import { store } from './redux/store.js'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <App />                          // ← No extra BrowserRouter needed
    </Provider>
  </React.StrictMode>,
)
