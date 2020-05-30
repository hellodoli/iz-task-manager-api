const { Schema, model } = require('mongoose');

const sectionSchema = new Schema({
  des: {
    type: String,
    required: true,
    trim: true
  },
  owner: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  }
}, {
  timestamps: true
});

const Section = new model('Section', sectionSchema);
module.exports = Section;
