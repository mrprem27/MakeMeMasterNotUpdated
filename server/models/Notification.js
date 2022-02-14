const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const notificationSchema = mongoose.Schema({
    time: { type: Date, default: new Date() },
    title: { type: String, required: true },
    post: { type: Schema.Types.ObjectId, ref: 'Post' },
    seen: { type: Boolean, default: false }
});

const Notification = mongoose.model('Notification', notificationSchema);
module.exports = Notification;