const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Section = require('../models/section');

router.post('/sections', auth, async (req, res) => {
  const section = new Section({
    ...req.body,
    owner: req.user._id
  });
  try {
    await section.save();
    res.status(201).send(section);
  } catch (error) {
    res.status(400).send(error);
  }
});

router.get('/sections', auth, async (req, res) => {
  try {
    const user = await req.user.populate({
      path: 'section'
    }).execPopulate();
    res.send(user.section);
  } catch (error) {
    res.status(500).send(error);
  }
});

router.patch('/sections/:id', auth, async (req, res) => {
  try {
    const updates = Object.keys(req.body);
    const allows = ['des', 'order'];
    const check = updates.every(update => allows.includes(update));
    if (!check) return res.status(400).send({ error: 'Invalid updates' });

    const section = await Section.findOne({
      _id: req.params.id,
      owner: req.user._id
    });

    if (!section) return res.status(404).send();
    updates.forEach(update => section[update] = req.body[update]);
    await section.save();
    res.send(section);
  } catch (error) {
    res.status(400).send(error);
  }
});

module.exports = router;