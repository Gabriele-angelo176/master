import { useState } from 'react'

const AddComment = ({ onAdd }) => {
  const [comment, setComment] = useState('')
  const [rate, setRate] = useState('5')

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (!comment.trim()) return
    await onAdd(comment.trim(), Number(rate))
    setComment('')
    setRate('5')
  }

  return (
    <form className="add-comment" onSubmit={handleSubmit}>
      <label htmlFor="comment-text">Scrivi una recensione</label>
      <textarea id="comment-text" value={comment} onChange={(event) => setComment(event.target.value)} required />
      <label htmlFor="comment-rate">Valutazione</label>
      <select id="comment-rate" value={rate} onChange={(event) => setRate(event.target.value)}>
        {[1, 2, 3, 4, 5].map((value) => <option key={value} value={value}>{value}/5</option>)}
      </select>
      <button type="button" onClick={handleSubmit}>Invia recensione</button>
    </form>
  )
}

export default AddComment
