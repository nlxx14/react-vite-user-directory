import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export default function Students() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { token, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchStudents() {
      try {
        const res = await fetch('http://localhost:3000/api/students', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error('Failed to fetch students');
        const data = await res.json();
        setStudents(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchStudents();
  }, [token]);

  function handleLogout() {
    logout();
    navigate('/login');
  }

  return (
    <div className="students-page">
      <h2>Students</h2>
      <button onClick={handleLogout}>Logout</button>

      {loading && <p>Loading...</p>}
      {error && <p className="error">{error}</p>}

      <ul>
        {students.map((s) => (
          <li key={s._id}>
            {s.name} - {s.email}
          </li>
        ))}
      </ul>
    </div>
  );
}