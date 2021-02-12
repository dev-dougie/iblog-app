const mongoose = require('mongoose')
const db = require('../config/db')

mongoose.Promise = global.Promise
mongoose.connect('mongodb://localhost/blogapp', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('Conneted to database'))
.catch(err => console.log('The connection with database was failed: ' + err))

