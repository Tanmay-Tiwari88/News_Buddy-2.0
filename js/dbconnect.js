const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/Albums', {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true
    })
    .then(() => console.log("connection succesful"))
    .catch((err) => {
        console.log(err)
    });

module.exports = exports = mongoose