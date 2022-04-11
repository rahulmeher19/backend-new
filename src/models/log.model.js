const mongoose = require('mongoose');
const validator = require('validator');
const User = require('./user.model');

const { Schema } = mongoose;
const { ObjectId } = Schema;

const logSchema = mongoose.Schema(
  {
    action: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    createdBy: {
      type: ObjectId,
      ref: 'User',
    },
    createdAt: {
      type: String,
    },
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    actionOn: {
      type: String,
      required: true,
    },
    diff: {
      type: Schema.Types.Mixed,
    },
  },
  {
    timestamps: {
      createdAt: 'createdAt',
      updatedAt: 'updatedAt',
    },
  }
);

logSchema.index({ action: 1, category: 1 });

const Log = mongoose.model('Log', logSchema);

// async function addLogsCollection() {
//   const LogRow = new Log({
//     action: 'Create User',
//     category: 'User',
//     createdBy: '624b227917006d33c4d2db20',
//     createdAt: 'Ashish',
//     user_id: '6246f462f5a6331b448cc03c',
//     actionOn: 'Ashish create Rahul',
//   });
//   LogRow.save();
// }
// addLogsCollection();
module.exports = Log;
