const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
require('../models/User')
const User = mongoose.model('users')
const bcrypt = require('bcryptjs')
const passport = require('passport')
const isAdmin = require('../helpers/isAdmin')

router.get('/registro', (req, res) => {
    res.render('user/register')
})

router.post('/registro', (req, res) => {
    let errors = []

    if (!req.body.name || typeof req.body.name == undefined || req.body.name == null) {
        errors.push({ text: 'Nome inválido!' })
    }

    if (!req.body.email) {
        errors.push({ text: 'E-mail inválido!' })
    }

    if (!req.body.password) {
        errors.push({ text: 'Senha inválida' })
    }

    if (req.body.password < 4) {
        errors.push({ text: 'Senha muito pequena. Mínimo: 4 caracteres.' })
    }

    if (req.body.password != req.body.password2) {
        errors.push({ text: 'As senhas não coincidem.' })
    }

    if (errors.length > 0) {
        res.render('user/register', { errors: errors })
    } else {

        User.findOne({ email: req.body.email })
            .then(user => {
                if (user) {
                    req.flash('error_msg', 'E-mail já em uso.')
                    res.redirect('/usuario/registro')

                } else {

                    const newUser = new User({
                        name: req.body.name,
                        email: req.body.email,
                        password: req.body.password
                    })

                    bcrypt.genSalt(10, (err, salt) => {
                        bcrypt.hash(newUser.password, salt, (err, hash) => {
                            if (err) {
                                req.flash('error_msg', 'Erro ao cadastrar usuário.')
                                res.redirect('/')
                            }

                            newUser.password = hash

                            newUser.save().then(() => {
                                req.flash('success_msg', 'Usuário criado com sucesso!')
                                res.redirect('/')
                            }).catch(() => {
                                req.flash('error_msg', 'Houve um erro ao criar o usuário. Tente novamente.')
                                res.redirect('/usuario/registro')
                            })



                        })
                    })

                }
            }).catch(() => {
                req.flash('error_msg', 'Houve um erro interno.')
                res.redirect('/')
            })
    }
})

router.get('/login', (req, res) => {
    res.render('user/login', { title: 'iBlog - Login' })
})

router.post('/login', (req, res, next) => {
    passport.authenticate("local", {
        successRedirect: "/",
        failureRedirect: "/usuario/login",
        failureFlash: true
    })(req, res, next)
})


router.get('/logout', (req, res) => {
    req.logout()
    req.flash('success_msg', 'Logout realizado. Até mais!')
    res.redirect('/')
})


module.exports = router