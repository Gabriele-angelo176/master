import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { apiFetch } from '../api/api';
import { useAuth } from '../auth/AuthContext';

export default function HomePage() {
  const navigate = useNavigate();
  const { logout, token } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }

    const loadPosts = async () => {
      try {
        const result = await apiFetch('/blogPosts');
        setPosts(result.posts || []);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    loadPosts();
  }, [token, navigate]);

  return (
    <div className="page-shell">
      <header className="topbar">
        <div>
          <h2>Strive Blog</h2>
        </div>
        <button type="button" className="secondary-button" onClick={logout}>
          Logout
        </button>
      </header>

      <main className="dashboard">
        <h1>Homepage</h1>

        {loading ? (
          <p>Caricamento post...</p>
        ) : posts.length === 0 ? (
          <p>Nessun post trovato.</p>
        ) : (
          <div className="post-grid">
            {posts.map((post) => (
              <article key={post._id} className="post-card">
                {post.cover && <img src={post.cover} alt={post.title} className="post-cover" />}

                <div className="post-card-body">
                  <span className="tag">{post.category || 'General'}</span>
                  <h3>{post.title}</h3>
                  <p>{post.content?.slice(0, 120)}...</p>

                  <div className="post-meta">
                    <span>{post.author?.name || 'Autore'}</span>
                    <span>{post.readTime?.value || 1} min</span>
                  </div>

                  <Link to={`/post/${post._id}`} className="link-button">
                    Leggi di più
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
