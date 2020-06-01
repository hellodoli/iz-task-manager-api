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

sectionSchema.methods.toJSON = function () {
  const section = this;
  const sectionObject = section.toObject();
  delete sectionObject.createdAt;
  delete sectionObject.updatedAt;
  return sectionObject;
}

const Section = new model('Section', sectionSchema);
module.exports = Section;
