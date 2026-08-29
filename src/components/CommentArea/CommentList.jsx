import SingleComment from './SingleComment'

const CommentList = ({ comments, onUpdate, onDelete }) => (
  <div className="comment-list">
    {comments.map((comment) => (
      <SingleComment key={comment._id} comment={comment} onUpdate={onUpdate} onDelete={onDelete} />
    ))}
  </div>
)

export default CommentList
