import { useState } from 'react'

const SingleComment = ({ comment, onUpdate, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false)
  const [text, setText] = useState(comment.comment)
  const [rate, setRate] = useState(comment.rate)

  const saveComment = async () => {
    if (!text.trim()) return
    await onUpdate(comment._id, text.trim(), Number(rate))
    setIsEditing(false)
  }

  return (
    <article className="single-comment">
      {isEditing ? (
        <>
          <textarea value={text} onChange={(event) => setText(event.target.value)} />
          <select value={rate} onChange={(event) => setRate(event.target.value)}>
            {[1, 2, 3, 4, 5].map((value) => <option key={value} value={value}>{value}/5</option>)}
          </select>
          <button type="button" onClick={saveComment}>Salva</button>
          <button type="button" onClick={() => setIsEditing(false)}>Annulla</button>
        </>
      ) : (
        <>
          <p>{comment.comment}</p>
          <strong>Valutazione: {comment.rate}/5</strong>
          <div>
            <button type="button" onClick={() => setIsEditing(true)}>Modifica</button>
            <button type="button" onClick={() => onDelete(comment._id)}>Elimina</button>
          </div>
        </>
      )}
    </article>
  )
}

export default SingleComment
