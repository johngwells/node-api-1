// implement your API here
const express = require('express');
const db = require('./data/db');
const server = express();
server.use(express.json());

// Get request
server.get('/', (req, res) => {
  res.send('Server is connected')
});

// Get: return all users
server.get('/users', (req, res) => {
  db.find()
    .then(users => res.status(200).json(users))
    .catch(() => { res.status(500).json
      ({ error: 'The users infomation could not be retrieved'})
    });
});

// Get: specific user using dynamic routing
server.get('/users/:id', (req, res) => {
  const id = req.params.id;
  db.findById(id)
    .then(user => res.status(201).json(user))
    .catch(err => { res.status(404).json
      ({ error: 'The user with the specified ID does not exist'})
    });
})

// Delete: remove user
server.delete('/users/:id', (req, res) => {
  const id = req.params.id;

  db.remove(id)
    .then(user => {
      if (user === 0) {
        res.status(404).json({ message: 'The user with the specified ID does not exist'})
      } else {
        res.status(200).json(user)
      }
    })
    .catch(() => {
      res.status(500).json({ error: 'The user was not deleted'})
    })
})

// Put: edit user
server.put('/users/:id', (req, res) => {
  const editUser = req.body;
  const id = req.params.id
  
  // if name & bio does not exist
  if (!editUser.name || !editUser.bio) {
    res.status(400).json({ error: 'Provide name & bio for user' })
  } else {
    db.update(id, editUser)
      .then(update => {
        if (update) {
          db.findById(id)
            .catch(() => { res.status(500).json
              ({ error: 'Could not find user with specified id' })
            })
        } else {
          res.status(404).json({ error: 'The user with specified ID does not exist'})
        }
      })
      .catch(() => {
        res.status(500).json({ message: 'The users infomation could not be modified'})
      })
  }
})

const port = 4000;
server.listen(port, (req, res) => console.log('=== Listening port 4000 ==='))