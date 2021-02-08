const localStrategy = require('passport-local').Strategy
const mongoose = require('mongoose')
//Compare passwords
const bcrypt = require('bcryptjs')
//User model
require('../models/User')
const User = mongoose.model('users')


module.exports = function(passport){
    passport.use(new localStrategy({
        usernameField: 'email'
    },
    (email, password, done) => {
        User.findOne({email: email})
        .then((user) => {
            if(!user){
                //Account data, authentication, message
                return done(null, false, {message: 'Esta conta não existe'})
            }

            bcrypt.compare(password, user.password, (error, ok) => {
                if(ok){
                    return done(null, user)
                }else{
                    return done(null, false, {message: 'Senha incorreta'})
                }
            })
        })
    }
    ))

    //Save the user's datas in a section
    passport.serializeUser((user, done) => {
        done(null, user.id)
    })

    passport.deserializeUser((id, done) => {
        User.findById(id, (err, user) => {
            done(err, user)
        })
    })
}