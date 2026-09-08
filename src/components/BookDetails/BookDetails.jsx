import { Link, useParams } from 'react-router-dom'
import fantasyBooks from '../../../../fantasy.json'
import CommentArea from '../CommentArea/CommentArea'

const BookDetails = () => {
  const { asin } = useParams()
  const book = fantasyBooks.find((item) => item.asin === asin)

  if (!book) {
    return <NotFoundBook />
  }

  return (
    <main className="book-details">
      <img src={book.img} alt={book.title} className="book-details__image" />
      <div className="book-details__content">
        <p className="book-details__category">{book.category}</p>
        <h1>{book.title}</h1>
        <p className="book-details__price">${book.price.toFixed(2)}</p>
        <p>ASIN: {book.asin}</p>
        <Link to="/" className="book-details__back">
          Back to all books
        </Link>
      </div>
      <CommentArea selected={book.asin} />
    </main>
  )
}

const NotFoundBook = () => (
  <main className="book-details">
    <div className="book-details__content">
      <h1>Book not found</h1>
      <p>The requested book does not exist in the catalogue.</p>
      <Link to="/" className="book-details__back">
        Back to all books
      </Link>
    </div>
  </main>
)

export default BookDetails
