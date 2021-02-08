const mongoose = require('mongoose')
const db = require('../config/db')

mongoose.Promise = global.Promise
mongoose.connect(db.mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('Conneted to database'))
.catch(err => console.log('The connection with database was failed: ' + err))

