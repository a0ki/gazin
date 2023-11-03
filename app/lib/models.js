const mongoose = require('mongoose');

const { Schema } = mongoose;
const { ObjectId } = mongoose.Types;

const userSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: ObjectId, ref: 'Role', required: true },
    gender: { type: String },
    age: { type: Number, required: true },
    birthdate: { type: Date, required: true },
    hobby: { type: String, required: true },
    status: { type: String, required: true, default: 'active' }
  },
  {
    timestamps: true,
  }
);

const roleSchema = new Schema(
  {
    name: { type: String, required: true },
    resources: [
      {
        resource: { type: String, required: true },
        permission: {
          read: { type: Boolean, required: true },
          create: { type: Boolean, required: true },
          update: { type: Boolean, required: true },
          delete: { type: Boolean, required: true },
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const User = mongoose.models.User || mongoose.model('User', userSchema);
const Role = mongoose.models.Role || mongoose.model('Role', roleSchema);

module.exports = { User, Role };