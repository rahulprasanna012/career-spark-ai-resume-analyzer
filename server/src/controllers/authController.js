import bcrypt from 'bcrypt';
import { pool } from '../config/db.js';
import { sign } from '../utils/auth.js';

// REGISTER
export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body || {};
    if (!name || !email || !password) return res.status(400).json({ error: 'Missing fields' });
    if (password.length < 6) return res.status(400).json({ error: 'Password too short' });

    const exists = await pool.query('SELECT 1 FROM users WHERE email=$1', [email]);
    if (exists.rowCount) return res.status(409).json({ error: 'Email already in use' });

    const hash = await bcrypt.hash(password, 12);
    const { rows } = await pool.query(
      'INSERT INTO users (name, email, password_hash) VALUES ($1,$2,$3) RETURNING id, name, email',
      [name, email, hash]
    );

    const token = sign(rows[0]);

    // send both cookie + body
    res.json({
      user: rows[0],
      token
    });
  } catch (e) {
    console.error('REGISTER ERR:', e);
    res.status(500).json({ error: 'Registration failed' });
  }
};

// LOGIN
export const login = async (req, res) => {
  try {
    const { email, password } = req.body || {};
    if (!email || !password) return res.status(400).json({ error: 'Missing fields' });

    const { rows } = await pool.query(
      'SELECT id, name, email, password_hash FROM users WHERE email=$1',
      [email]
    );
    const user = rows[0];
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });

    const ok = await bcrypt.compare(password, user.password_hash);
    if (!ok) return res.status(401).json({ error: 'Invalid credentials' });

    const token = sign(user);

   
    res.json({
      user: { id: user.id, name: user.name, email: user.email },
      token
    });
  } catch (e) {
    console.error('LOGIN ERR:', e);
    res.status(500).json({ error: 'Login failed' });
  }
};

// CURRENT USER
export const me = async (req, res) => {
  res.json({ user: req.user });
};
