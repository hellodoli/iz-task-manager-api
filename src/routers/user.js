const express = require('express');
const router = express.Router();
const User = require('../models/user');
const auth = require('../middleware/auth');
const multer = require('multer');

const upload = multer({ 
  limits: {
    fileSize: 1000000
  },
  fileFilter (req, file, cb) {
    cb(undefined, true);
  }
});

router.post('/users/me/avatar', auth, upload.single('avatar'), async (req, res) => {
  req.user.avatar = req.file.buffer;
  await req.user.save();
  res.send();
}, (error, req, res) => {
  res.status(400).send(error);
});

router.get('/users', auth, async (req, res) => {
  try {
    const users = await User.find();
    res.send(users);
  } catch (error) {
    res.status(500).send(error);
  }
});

router.get('/users/me', auth, (req, res) => {
  res.send(req.user);
});

router.patch('/users/me', auth, async (req, res) => {
  const updates = Object.keys(req.body);
  const allows = ['name', 'age', 'password', 'email'];
  
  for (let i = 0; i < updates.length; i++) {
    if (!allows.includes(updates[i])) {
      return res.status(400).send({ error: 'Invalid updates' });
    }
  }

  try {
    updates.forEach(update => req.user[update] = req.body[update]);
    await req.user.save();
    res.send(req.user);
  } catch (error) {
    res.status(400).send(error);
  }
});

router.delete('/users/me', auth, async (req, res) => {
  try {
    await req.user.remove();
    res.send(req.user);
  } catch (error) {
    res.status(500).send(error);
  }
});

// sign up
router.post('/users', async (req, res) => {
  const user = new User(req.body);
  try {
    await user.save();
    const token = await user.generateToken();
    res.status(201).send({ user, token });
  } catch (error) {
    res.status(400).send(error);
  }
});

// sign in
router.post('/users/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    // result can be Error or can be User
    const result = await User.findCredentials(email, password, res);
    if (result.isError) { // Error
      const error = result;
      res.send(error);
    } else { // User
      const user = result;
      const token = await user.generateToken();
      res.send({ user, token });
    }
  } catch (error) {
    res.status(400).send(error);
  }
});

// logout
router.post('/users/logout', auth, async (req, res) => {
  try {
    const tokens = req.user.tokens.filter(token => token.token !== req.token);
    req.user.tokens = tokens;
    await req.user.save();
    res.send(req.user);  
  } catch (error) {
    res.status(500).send(error);
  }
});

// logout all
router.post('/users/logout/all', auth, async (req, res) => {
  try {
    console.log('logout all');
    req.user.tokens = [];
    await req.user.save();
    res.send(req.user);
  } catch (error) {
    res.status(500).send(error);
  }
});

// check token user



module.exports = router;