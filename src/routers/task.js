const express = require('express');
const router = express.Router();
const Task = require('../models/task');
const auth = require('../middleware/auth');

const checkValidDataUpdate = (dataUpdate) => {
  const updates = Object.keys(dataUpdate);
  const allows = ['des', 'completed', 'subtasks', 'index'];
  const isValid = updates.every(update => allows.includes(update));
  return new Promise((resolve, reject) => {
    if (isValid) resolve(updates);
    else reject();
  });
}

router.post('/tasks', auth, async (req, res) => {
  const task = new Task({
    ...req.body,
    owner: req.user._id
  });
  try {
    await task.save();
    res.status(201).send(task);
  } catch (error) {
    res.status(400).send(error);
  }
});

router.get('/tasks', auth, async (req, res) => {
  const match = {};
  const query = req.query;
  
  if (query.schedule) {
    if (query.schedule === 'today') {
      const curDate = new Date().toJSON();
      match.schedule = curDate.substring(0, 10);
    }
  }

  try {
    const user = await req.user.populate({
      path: 'task',
      match, // filter
      // limit: 3, // how many item
      // skip: 2 // index data item
    }).execPopulate();
    res.send(user.task);
  } catch (error) {
    res.status(500).send(error);
  }
});

router.get('/tasks/:id', auth, async (req, res) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, owner: req.user._id });
    if (!task) return res.status(404).send();
    await task.populate('owner').execPopulate();
    res.send(task);
  } catch (error) {
    res.status(500).send(error);
  }
});

router.patch('/tasks/:id', auth, async (req, res) => {
  checkValidDataUpdate(req.body)
    .then(async (updates) => {
      const task = await Task.findOne({
        _id: req.params.id,
        owner: req.user._id
      });
      if (!task) return res.status(404).send();
      updates.forEach(update => task[update] = req.body[update]);
      await task.save();
      res.send(task);
    })
    .catch((error) => {
      res.status(400).send(error);
    });
  /*const updates = Object.keys(req.body);
  const allows = ['des', 'completed', 'subtasks', 'index'];
  for (let i = 0; i < updates.length; i++) {
    if (!allows.includes(updates[i])) {
      return res.status(400).send({ error: 'Invalid updates' });
    }
  }
  try {
    const task = await Task.findOne({ _id: req.params.id, owner: req.user._id });
    if (!task) return res.status(404).send();
    updates.forEach(update => task[update] = req.body[update]);
    await task.save();
    res.send(task);
  } catch (error) {
    res.status(400).send(error);
  }*/
});

router.delete('/tasks/:id', auth, async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({ _id: req.params.id, owner: req.user._id });
    if (!task) return res.status(404).send();
    res.send(task);
  } catch (error) {
    res.status(400).send(error);
  }
});

// just testing for update many
router.patch('/many', auth, async (req, res) => {
  try {
    let count = 0;
    let raws = [];
    req.body.arrTask.forEach(task => {
      Task.update(
        { _id: task._id }, // condition (query)
        { index: task.index }, // value
        (err, raw) => {
          if (err) res.send(err);
          if (raw) {
            count += 1;
            raws.push(raw);
            if (count === req.body.arrTask.length) {
              res.send({ raws });
            }
          }
        }
      );
    });
  } catch (error) {
    res.status(400).send(error);
  }
});

module.exports = router;