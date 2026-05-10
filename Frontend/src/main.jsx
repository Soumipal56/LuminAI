import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './app/index.css'
import App from './app/App.jsx'
import { store } from './app/app.store.js'
import { Provider } from 'react-redux'
import { ThemeProvider } from './app/context/ThemeContext.jsx'

createRoot(document.getElementById('root')).render(
    <Provider store={store}>
      <ThemeProvider>
        <App />
      </ThemeProvider>
    </Provider>
)
