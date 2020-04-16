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
  subtasks: [{
    des: {
      type: String,
      required: true,
      trim: true
    }
  }],
  schedule: {
    type: Schema.Types.Date,
    default: null
  },
  section: {
    type: String,
    default: null
  },
  owner: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  }
}, {
  timestamps: true
});

const Task = new model('Task', taskSchema);
module.exports = Task;