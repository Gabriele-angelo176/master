import { useState } from 'react'
import './App.css'
import Navbar from './components/Navbar/Navbar'
import MyFooter from './components/Footer/footer'
import AllTheBooks from './components/AllTheBooks/AllTheBooks'
import { ThemeProvider } from './context/ThemeContext'

function App() {
  const [searchTerm, setSearchTerm] = useState('')

  return (
    <ThemeProvider>
      <Navbar searchTerm={searchTerm} onSearchChange={setSearchTerm} />
      <AllTheBooks searchTerm={searchTerm} />
      <MyFooter />
    </ThemeProvider>
  )
}

export default App
