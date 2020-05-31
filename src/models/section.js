const { Schema, model } = require('mongoose');

const sectionSchema = new Schema({
  section: {
    type: String,
    required: true,
    trim: true
  },
  owner: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  order: {
    type: Number,
    required: true
  }
}, {
  timestamps: true
});

const Section = new model('Section', sectionSchema);
module.exports = Section;
