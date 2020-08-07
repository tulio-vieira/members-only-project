var mongoose = require('mongoose');
const moment = require('moment');

var Schema = mongoose.Schema;

var MessageSchema = new Schema(
    {
        user: {type: Schema.Types.ObjectId, ref: 'User', required: true},
        title: { type: String, required: true, maxlength: 50 },
        text: { type: String, required: true, maxlength: 500 },
        date: { type: Date, default: Date.now }
    }
);


// Virtual for formatted date
MessageSchema
.virtual('date_formatted')
.get(function () {
    if ((Date.now() - this.date) < 86400000) {
        return moment(this.date).fromNow();
    }
    return moment(this.date).calendar();
});

//Export model
module.exports = mongoose.model('Message', MessageSchema);