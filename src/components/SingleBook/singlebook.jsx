import { useState } from 'react'
import '../AllTheBooks/AllTheBooks.css'
import CommentArea from '../CommentArea/CommentArea'

const SingleBook = ({ book }) => {
	const [selected, setSelected] = useState(false)

	return (
		<article className="book-card">
			<img
				src={book.img}
				alt={book.title}
				className={`book-card__image ${selected ? 'book-card__image--selected' : ''}`}
				onClick={() => setSelected((currentSelected) => !currentSelected)}
			/>
			{selected && <CommentArea bookId={book.asin} />}
		</article>
	)
}

export default SingleBook
