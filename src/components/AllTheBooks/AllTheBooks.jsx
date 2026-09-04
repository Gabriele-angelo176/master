import fantasyBooks from '../../../../fantasy.json'
import { useState } from 'react'
import './AllTheBooks.css'
import SingleBook from '../SingleBook/singlebook'
import CommentArea from '../CommentArea/CommentArea'
import { useTheme } from '../../context/ThemeContext'

const AllTheBooks = ({ searchTerm = '' }) => {
  const [selected, setSelected] = useState(null)
  const { theme } = useTheme()
  const normalizedQuery = searchTerm.toLowerCase()

  return (
    <section className={`all-books ${theme === 'dark' ? 'all-books--dark' : ''}`}>
      <h2 className={`all-books__title ${theme === 'dark' ? 'all-books__title--dark' : ''}`}>
        All the books
      </h2>
      <div className="all-books__layout">
        <div className="all-books__grid">
          {fantasyBooks
            .filter((book) =>
              book.title.toLowerCase().includes(normalizedQuery)
            )
            .map((book) => (
              <SingleBook
                key={book.asin}
                book={book}
                selected={selected}
                onSelect={setSelected}
              />
            ))}
        </div>
        <CommentArea selected={selected} />
      </div>
    </section>
  )
}

export default AllTheBooks
