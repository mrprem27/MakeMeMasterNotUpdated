const mongoose = require('mongoose');

const socketTKNSchema = mongoose.Schema({
    socketId=String,
    room:String,
    name:String
});

const SocketTKN = mongoose.model('SocketTKN', socketTKNSchema);
module.exports = SocketTKN;