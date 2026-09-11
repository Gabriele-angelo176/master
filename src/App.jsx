import { useState } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import Navbar from './components/Navbar/Navbar'
import MyFooter from './components/Footer/footer'
import AllTheBooks from './components/AllTheBooks/AllTheBooks'
import BookDetails from './components/BookDetails/BookDetails'
import NotFound from './components/NotFound/NotFound'
import { ThemeProvider } from './context/ThemeContext'
import Welcome from './components/Welcome/Welcome'

function App() {
  const [searchTerm, setSearchTerm] = useState('')

  return (
    <BrowserRouter>
      <ThemeProvider>
        <Navbar searchTerm={searchTerm} onSearchChange={setSearchTerm} />
        <Welcome />
        <Routes>
          <Route path="/" element={<AllTheBooks searchTerm={searchTerm} />} />
          <Route path="/books/:asin" element={<BookDetails />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <MyFooter />
      </ThemeProvider>
    </BrowserRouter>
  )
}

export default App
