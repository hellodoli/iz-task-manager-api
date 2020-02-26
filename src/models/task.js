const { Schema, model } = require('mongoose');

const taskSchema = new Schema({
  des: { 
    type: String,
    required: true,
    trim: true
  },
  completed: {
    type: Boolean,
    default: false
  },
  owner: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  }
});

const Task = new model('Task', taskSchema);
module.exports = Task;