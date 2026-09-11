import '../AllTheBooks/AllTheBooks.css'
import { Button, Card } from 'react-bootstrap'
import { Link } from 'react-router-dom'

const SingleBook = ({ book, selected, onSelect }) => {
	const isSelected = selected === book.asin

	return (
		<Card className="book-card">
			<img
				src={book.img}
				alt={book.title}
				className={`book-card__image ${isSelected ? 'book-card__image--selected' : ''}`}
				onClick={() => onSelect(isSelected ? null : book.asin)}
			/>
			<Button as={Link} className="book-card__details-link" to={`/books/${book.asin}`}>
				View details
			</Button>
		</Card>
	)
}

export default SingleBook
