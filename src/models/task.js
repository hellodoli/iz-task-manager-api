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
  index: {
    bySection: {
      type: Number
    },
    byToday: {
      type: Number
    },
    byUpcoming: {
      type: Number
    }
  },
  schedule: {
    type: Schema.Types.Date,
    default: null
  },
  section: {
    type: Schema.Types.ObjectId,
    default: null,
    ref: 'Section'
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