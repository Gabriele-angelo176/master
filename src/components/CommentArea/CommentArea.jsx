import { Component } from 'react'
import AddComment from './AddComment'
import CommentList from './CommentList'
import './CommentArea.css'

const COMMENTS_API_URL = 'https://striveschool-api.herokuapp.com/api/comments/'
const COMMENTS_AUTH_TOKEN = import.meta.env.VITE_COMMENTS_AUTH_TOKEN

const getRequestOptions = (options = {}) => ({
  ...options,
  headers: {
    ...(COMMENTS_AUTH_TOKEN && { Authorization: `Bearer ${COMMENTS_AUTH_TOKEN}` }),
    ...options.headers,
  },
})

class CommentArea extends Component {
  state = {
    comments: [],
    isLoading: false,
    error: '',
  }

  componentDidUpdate(prevProps) {
    if (prevProps.selected !== this.props.selected) {
      this.loadComments()
    }
  }

  loadComments = async () => {
    const { selected } = this.props

    if (!selected) {
      this.setState({ comments: [], isLoading: false, error: '' })
      return
    }

    this.setState({ isLoading: true, error: '' })
    try {
      const response = await fetch(`${COMMENTS_API_URL}${selected}`, getRequestOptions())
      if (!response.ok) throw new Error('Impossibile caricare le recensioni.')
      this.setState({ comments: await response.json() })
    } catch (requestError) {
      this.setState({ error: requestError.message })
    } finally {
      this.setState({ isLoading: false })
    }
  }

  sendRequest = async (url, options, message) => {
    this.setState({ error: '' })
    try {
      const response = await fetch(url, getRequestOptions(options))
      if (!response.ok) throw new Error(message)
      await this.loadComments()
    } catch (requestError) {
      this.setState({ error: requestError.message })
    }
  }

  addComment = (comment, rate, elementId) => this.sendRequest(
    COMMENTS_API_URL,
    { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ comment, rate, elementId }) },
    'Impossibile pubblicare la recensione.'
  )

  updateComment = (commentId, comment, rate) => this.sendRequest(
    `${COMMENTS_API_URL}${commentId}`,
    { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ comment, rate, elementId: this.props.selected }) },
    'Impossibile modificare la recensione.'
  )

  deleteComment = async (commentId) => {
    this.setState({ error: '' })
    try {
      const response = await fetch(`${COMMENTS_API_URL}${commentId}`, getRequestOptions({ method: 'DELETE' }))
      if (!response.ok) throw new Error('Impossibile eliminare la recensione.')
      this.setState((currentState) => ({
        comments: currentState.comments.filter((item) => item._id !== commentId),
      }))
    } catch (requestError) {
      this.setState({ error: requestError.message })
    }
  }

  render() {
    const { selected } = this.props
    const { comments, isLoading, error } = this.state

    return (
      <section className="comment-area" aria-label="Recensioni del libro">
        <h3>Recensioni</h3>
        {!selected && <p className="comment-area__status">Seleziona un libro per visualizzare le recensioni.</p>}
        {isLoading && <p className="comment-area__status"><span className="comment-area__spinner" aria-hidden="true" />Caricamento...</p>}
        {error && <p className="comment-area__error">{error}</p>}
        {!isLoading && !error && selected && comments.length === 0 && <p className="comment-area__status">Nessuna recensione presente.</p>}
        {selected && <CommentList comments={comments} onUpdate={this.updateComment} onDelete={this.deleteComment} />}
        {selected && <AddComment elementId={selected} onAdd={this.addComment} />}
      </section>
    )
  }
}

export default CommentArea
