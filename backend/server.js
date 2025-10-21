const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');

const app = express();
const PORT = 5552; // Using port 5552 for the backend

app.use(cors());
app.use(express.json());

// Initialize SQLite database
const db = new sqlite3.Database('./database.sqlite', (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
  } else {
    console.log('Connected to the SQLite database.');
    db.run(`CREATE TABLE IF NOT EXISTS scenes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      image_prompt TEXT NOT NULL,
      video_prompt TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`, (createErr) => {
      if (createErr) {
        console.error('Error creating table:', createErr.message);
      } else {
        console.log('Table "scenes" created or already exists.');
      }
    });

    db.run(`CREATE TABLE IF NOT EXISTS characters (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      description TEXT,
      appearance TEXT,
      personality TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`, (createErr) => {
      if (createErr) {
        console.error('Error creating characters table:', createErr.message);
      } else {
        console.log('Table "characters" created or already exists.');
      }
    });
  }
});

// Character Routes
// Get character (assuming only one character for now, or the latest)
app.get('/api/character', (req, res) => {
  db.get('SELECT * FROM characters ORDER BY created_at DESC LIMIT 1', (err, row) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (!row) {
      res.status(404).json({ message: 'No character found' });
      return;
    }
    res.json(row);
  });
});

// Create or update character (upsert-like behavior for a single character)
app.post('/api/character', (req, res) => {
  const { name, description, appearance, personality } = req.body;
  if (!name) {
    return res.status(400).json({ error: 'Character name is required' });
  }

  // Check if a character already exists
  db.get('SELECT id FROM characters ORDER BY created_at DESC LIMIT 1', (err, row) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }

    if (row) {
      // Update existing character
      db.run('UPDATE characters SET name = ?, description = ?, appearance = ?, personality = ? WHERE id = ?',
        [name, description, appearance, personality, row.id],
        function (updateErr) {
          if (updateErr) {
            res.status(500).json({ error: updateErr.message });
            return;
          }
          res.json({ id: row.id, name, description, appearance, personality, message: 'Character updated successfully' });
        }
      );
    } else {
      // Insert new character
      db.run('INSERT INTO characters (name, description, appearance, personality) VALUES (?, ?, ?, ?)',
        [name, description, appearance, personality],
        function (insertErr) {
          if (insertErr) {
            res.status(500).json({ error: insertErr.message });
            return;
          }
          res.status(201).json({ id: this.lastID, name, description, appearance, personality, message: 'Character created successfully' });
        }
      );
    }
  });
});

// Delete character (assuming only one character, or the latest)
app.delete('/api/character/:id', (req, res) => {
  const { id } = req.params;
  db.run('DELETE FROM characters WHERE id = ?', [id], function (err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (this.changes === 0) {
      res.status(404).json({ error: 'Character not found' });
      return;
    }
    res.json({ message: 'Character deleted successfully' });
  });
});

// Routes
// Get all scenes
app.get('/api/scenes', (req, res) => {
  db.all('SELECT * FROM scenes ORDER BY created_at DESC', (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

// Create a new scene
app.post('/api/scenes', (req, res) => {
  const { title, image_prompt, video_prompt } = req.body;
  if (!title || !image_prompt || !video_prompt) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  db.run('INSERT INTO scenes (title, image_prompt, video_prompt) VALUES (?, ?, ?)',
    [title, image_prompt, video_prompt],
    function (err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.status(201).json({ id: this.lastID, title, image_prompt, video_prompt });
    }
  );
});

// Get a single scene by ID
app.get('/api/scenes/:id', (req, res) => {
  const { id } = req.params;
  db.get('SELECT * FROM scenes WHERE id = ?', [id], (err, row) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (!row) {
      res.status(404).json({ error: 'Scene not found' });
      return;
    }
    res.json(row);
  });
});

// Update a scene
app.put('/api/scenes/:id', (req, res) => {
  const { id } = req.params;
  const { title, image_prompt, video_prompt } = req.body;
  if (!title || !image_prompt || !video_prompt) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  db.run('UPDATE scenes SET title = ?, image_prompt = ?, video_prompt = ? WHERE id = ?',
    [title, image_prompt, video_prompt, id],
    function (err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      if (this.changes === 0) {
        res.status(404).json({ error: 'Scene not found' });
        return;
      }
      res.json({ message: 'Scene updated successfully' });
    }
  );
});

// Delete a scene
app.delete('/api/scenes/:id', (req, res) => {
  const { id } = req.params;
  db.run('DELETE FROM scenes WHERE id = ?', [id], function (err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (this.changes === 0) {
      res.status(404).json({ error: 'Scene not found' });
      return;
    }
    res.json({ message: 'Scene deleted successfully' });
  });
});


app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});