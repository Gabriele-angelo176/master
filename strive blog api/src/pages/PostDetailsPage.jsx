import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { apiFetch } from '../api/api';
import { useAuth } from '../auth/AuthContext';

export default function PostDetailsPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState('');
  const [loading, setLoading] = useState(true);

  const loadPost = async () => {
    try {
      const result = await apiFetch(`/blogPosts/${id}`);
      setPost(result.post);
      const commentsResult = await apiFetch(`/blogPosts/${id}/comments`);
      setComments(commentsResult.comments || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPost();
  }, [id]);

  const handleAddComment = async (event) => {
    event.preventDefault();
    if (!commentText.trim()) return;

    try {
      await apiFetch(`/blogPosts/${id}`, {
        method: 'POST',
        body: JSON.stringify({
          text: commentText,
          author: user?.name || 'Anonimo',
        }),
      });
      setCommentText('');
      await loadPost();
    } catch (error) {
      console.error(error);
    }
  };

  if (loading) {
    return <div className="page-shell"><p>Caricamento post...</p></div>;
  }

  if (!post) {
    return <div className="page-shell"><p>Post non trovato.</p></div>;
  }

  return (
    <div className="page-shell post-detail-page">
      <header className="topbar">
        <Link to="/" className="back-link">← Home</Link>
      </header>

      <article className="post-detail">
        {post.cover && <img src={post.cover} alt={post.title} className="detail-cover" />}

        <div className="detail-body">
          <span className="tag">{post.category || 'General'}</span>
          <h1>{post.title}</h1>

          <div className="post-meta detail-meta">
            <span>{post.author?.name || 'Autore'}</span>
            <span>{post.readTime?.value || 1} min</span>
          </div>

          <p className="post-content">{post.content}</p>
        </div>
      </article>

      <section className="comments-panel">
        <h3>Commenti</h3>

        <form onSubmit={handleAddComment} className="comment-form">
          <textarea
            value={commentText}
            onChange={(event) => setCommentText(event.target.value)}
            placeholder="Scrivi un commento..."
            rows={4}
          />
          <button type="submit" className="primary-button">Aggiungi commento</button>
        </form>

        {comments.length === 0 ? (
          <p>Nessun commento ancora.</p>
        ) : (
          <ul className="comment-list">
            {comments.map((comment) => (
              <li key={comment._id || `${comment.author}-${comment.createdAt}`}>
                <strong>{comment.author || 'Anonimo'}</strong>
                <p>{comment.text}</p>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
