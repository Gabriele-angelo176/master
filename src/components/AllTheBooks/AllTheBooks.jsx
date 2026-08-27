import { useState } from 'react'
import fantasyBooks from '../../../../fantasy.json'
import './AllTheBooks.css'
import SingleBook from '../SingleBook/singlebook'

const AllTheBooks = () => {
  const [searchTerm, setSearchTerm] = useState('')

  return (
    <section className="all-books">
      <h2 className="all-books__title">All the books</h2>
      <input
        type="text"
        value={searchTerm}
        onChange={(event) => setSearchTerm(event.target.value)}
        placeholder="Search by title"
        aria-label="Search books by title"
      />
      <div className="all-books__grid">
        {fantasyBooks
          .filter((book) =>
            book.title.toLowerCase().includes(searchTerm.toLowerCase())
          )
          .map((book) => (
          <SingleBook key={book.asin} book={book} />
          ))}
      </div>
    </section>
  )
}

export default AllTheBooks
