const mongoose = require('mongoose');
const shortid = require('shortid');
const Schema = mongoose.Schema;

const Url = new Schema({
    initUrl: {type: String, required: true},
    shortenedId: {type: String, required: true, default: shortid.generate}
});
module.exports = mongoose.model('Url', Url);