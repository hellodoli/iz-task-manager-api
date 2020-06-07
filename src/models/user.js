const { Schema, model } = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const userSchema = new Schema({
  name : {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    validate(value) {
      if (!validator.isEmail(value)) {
        throw new Error('Email invalid');
      }
    }
  },
  password: {
    type: String,
    required: true,
    trim: true,
    minlength: 7,
    validate(value) {
      if (value.toLowerCase().includes('password')) {
        throw new Error('Password must not contain "password"');
      }
    }
  },
  age: {
    type: Number,
    default: 0,
    validate(value) {
      if (value < 0) {
        throw new Error('Age invalid');
      }
    }
  },
  tokens: [{
    token: {
      type: String,
      required: true
    }
  }],
  avatar: {
    type: Buffer
  },
  overdate: {
    type: Schema.Types.Date
  }
}, {
  timestamps: true
});

userSchema.virtual('task', {
  ref: 'Task',
  localField: '_id',
  foreignField: 'owner'
});

userSchema.virtual('section', {
  ref: 'Section',
  localField: '_id',
  foreignField: 'owner'
});

userSchema.pre('save', async function (next) {
  const user = this;
  console.log('just before save');
  if (user.isModified('password')) {
    // check when create password
    console.log('create password');
    user.password = await bcrypt.hash(user.password, 8);
  }
  next();
});

userSchema.methods.toJSON = function () {
  const user = this;
  const userObject = user.toObject();
  delete userObject.password;
  delete userObject.tokens;
  delete userObject.avatar;
  return userObject;
}

userSchema.methods.generateToken = async function () {
  const user = this;
  const token = jwt.sign({ _id: user._id.toString() }, process.env.JWT_SECRET);
  user.tokens = user.tokens.concat({ token });
  await user.save();
  return token;
}

userSchema.statics.findCredentials = async (email, password) => {
  let result = {};
  const user = await User.findOne({ email });
  if (!user) {
    result = { isError: true, errorCode: 1, error: 'Wrong email' };
  } else {
    result = user;
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      result = { isError: true, errorCode: 2, error: 'Wrong password' };
    }
  }
  return result;
};

const User = new model('User', userSchema);
module.exports = User;