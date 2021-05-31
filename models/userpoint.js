// location.js (Model)

var mongoose = require('mongoose');

//Set schema
var userpointSchema = mongoose.Schema({
    location: {
        type: {
            type: String
        },
        coordinates: [Number]
    },
    username: {
        type: String,
        required: true,
    },
    userdocumentid:{
        type: String
    },
    creationdate:{
        type: Date,
        default:Date.now
    },
    mobile: {
        type: String
    },
    //isAssigned:{
    //    type: String
    //},
    //userDocumentId: {
    //    type: String
    //},
});
userpointSchema.index({ location: "2dsphere" }); //2dsphere
//Export Navigate model
var Userpoint = module.exports = mongoose.model('userpoint', userpointSchema);


module.exports.get = function (callback, limit) {
    Userpoint.find(callback).limit(limit);
}