let utils = require('../../lib/utils');
let mongoose = require('../../lib/mongoose');
let schemaOptions = require('config').get('mongoose.schemaOptions');

let Schema = mongoose.Schema;

/**
 * @swagger
 * definitions:
 *   User:
 *     required:
 *       - username
 *       - email
 *     properties:
 *       username:
 *         type: string
 *       age:
 *         type: number
 *       name:
 *         first:
 *           type: string
 *         last:
 *           type: string
 */
let userInfoSchema = new Schema({
  username: { type: String, trim: true, unique: true, required: true },
  age: { type: Number, min: 1 },
  name: {
    first: { type: String, trim: true },
    last: { type: String, trim: true },
  },
  email: { type: String, trim: true, unique: true, required: true, match: utils.emailRegex, lowercase: true },
  extra: { type: Schema.Types.Mixed, default: {} },
  spouse: [{ type: Schema.Types.ObjectId, ref: 'UserInfo'}],
}, schemaOptions);

userInfoSchema.virtual('fullname')
.get(function() {
  return this.name.first + ' ' + this.name.last;
})
.set(function(v) {
  let vList = v.split(' ');
  this.name.first = vList[0];
  this.name.last = vList[(vList.length - 1) < 1 ? 1 : (vList.length - 1)];
});

// Instance methods for document
userInfoSchema.methods.testInstanceMethod = function() {
  console.log('this is: ', this, ' from testInstanceMethod');
};

// Static methods for model
userInfoSchema.statics.testStaticMethod = function() {
  console.log('this is: ', this, ' from testStaticMethod');
};

let UserInfo = mongoose.conn.model('UserInfo', userInfoSchema);

UserInfo.on('error', function(err) {
  if (err) {
    console.log('err:', err);
  }
});

module.exports = UserInfo;
