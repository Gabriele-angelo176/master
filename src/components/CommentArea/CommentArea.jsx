import { useEffect, useState } from 'react'
import AddComment from './AddComment'
import CommentList from './CommentList'
import './CommentArea.css'

const COMMENTS_API_URL = 'https://striveschool-api.herokuapp.com/api/comments/'

const CommentArea = ({ bookId }) => {
  const [comments, setComments] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  const loadComments = async () => {
    setIsLoading(true)
    setError('')
    try {
      const response = await fetch(`${COMMENTS_API_URL}${bookId}`)
      if (!response.ok) throw new Error('Impossibile caricare le recensioni.')
      setComments(await response.json())
    } catch (requestError) {
      setError(requestError.message)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadComments()
  }, [bookId])

  const sendRequest = async (url, options, message) => {
    setError('')
    try {
      const response = await fetch(url, options)
      if (!response.ok) throw new Error(message)
      await loadComments()
    } catch (requestError) {
      setError(requestError.message)
    }
  }

  const addComment = (comment, rate) => sendRequest(
    COMMENTS_API_URL,
    { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ comment, rate, elementId: bookId }) },
    'Impossibile pubblicare la recensione.'
  )

  const updateComment = (commentId, comment, rate) => sendRequest(
    `${COMMENTS_API_URL}${commentId}`,
    { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ comment, rate, elementId: bookId }) },
    'Impossibile modificare la recensione.'
  )

  const deleteComment = async (commentId) => {
    setError('')
    try {
      const response = await fetch(`${COMMENTS_API_URL}${commentId}`, { method: 'DELETE' })
      if (!response.ok) throw new Error('Impossibile eliminare la recensione.')
      setComments((currentComments) => currentComments.filter((item) => item._id !== commentId))
    } catch (requestError) {
      setError(requestError.message)
    }
  }

  return (
    <section className="comment-area" aria-label="Recensioni del libro">
      <h3>Recensioni</h3>
      {isLoading && <p className="comment-area__status"><span className="comment-area__spinner" aria-hidden="true" />Caricamento...</p>}
      {error && <p className="comment-area__error">{error}</p>}
      {!isLoading && !error && comments.length === 0 && <p className="comment-area__status">Nessuna recensione presente.</p>}
      <CommentList comments={comments} onUpdate={updateComment} onDelete={deleteComment} />
      <AddComment onAdd={addComment} />
    </section>
  )
}

export default CommentArea
