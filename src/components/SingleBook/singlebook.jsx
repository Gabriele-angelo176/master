import '../AllTheBooks/AllTheBooks.css'

const SingleBook = ({ book, selected, onSelect }) => {
	const isSelected = selected === book.asin

	return (
		<article className="book-card">
			<img
				src={book.img}
				alt={book.title}
				className={`book-card__image ${isSelected ? 'book-card__image--selected' : ''}`}
				onClick={() => onSelect(isSelected ? null : book.asin)}
			/>
		</article>
	)
}

export default SingleBook
