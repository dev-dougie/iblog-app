const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
require('../models/Category')
require('../models/Post')
const Category = mongoose.model('categories')
const Post = mongoose.model('posts')
const { isAdmin } = require('../helpers/isAdmin')

router.get('/', (req, res) => {
    res.render('admin/index')
})

//==============CATEGORIES===========
router.get('/categorias', (req, res) => {
    Category.find()
        .sort({ date: 'desc' })
        .then(categories => {
            res.render('admin/categories',
                { categories: categories.map(category => category.toJSON()) })
        }).catch(() => {
            req.flash('error_msg', 'Houve um erro ao listar as categorias.')
            res.redirect('/admin')
        })
})

router.get('/categorias/add', (req, res) => {
    res.render('admin/addCategory')
})

router.post('/categorias/new', (req, res) => {

    let errors = []

    if (!req.body.name || typeof req.body.name == undefined || req.body.name == null) {
        errors.push({ text: 'Nome inválido!' })
    }

    if (!req.body.slug || typeof req.body.slug == undefined || req.body.slug == null) {
        errors.push({ text: 'Slug inválido!' })
    }

    if (req.body.name.length < 2) {
        errors.push({ text: 'Nome muito pequeno!' })
    }

    if (errors.length > 0) {
        res.render('admin/addCategory', { errors: errors })
    } else {


        const newCategory = {
            name: req.body.name,
            slug: req.body.slug
        }

        new Category(newCategory).save()
            .then(() => {
                req.flash('success_msg', 'Categoria criada com sucesso!')
                res.redirect('/admin/categorias')
                console.log('Categoria salva com sucesso!')
            })
            .catch(err => {
                req.flash('error_msg', 'Falha ao cadastrar categoria.')
                res.redirect('admin/categorias/add')
                console.log('Erro ao salvar categoria.' + err)
            })
    }
})

router.get('/categorias/update/:id', (req, res) => {
    Category.findOne({ _id: req.params.id })
        .lean()
        .then(category => {
            res.render('admin/updateCategory', { category: category, title: 'Atualizar categoria' })
        })
        .catch(() => {
            req.flash('error_msg', 'Essa categoria não existe')
            res.redirect('/admin/categorias')
        })
})

//Fazer validação
router.post('/categorias/update', (req, res) => {
    Category.findOne({ _id: req.body.id })
        .then(category => {
            category.name = req.body.name
            category.slug = req.body.slug

            category.save().then(() => {
                req.flash('success_msg', 'Categoria atualizada com sucesso! :)')
                res.redirect('/admin/categorias')
            })
        })
        .catch(() => {
            req.flash('error_msg', 'Houve um erro ao atualizar a categoria')
            res.redirect('/admin/categorias')
        })
})

router.post('/categorias/delete', (req, res) => {
    Category.deleteOne({ _id: req.body.id })
        .then(() => {
            req.flash('success_msg', 'Categoria deletada com sucesso.')
            res.redirect('/admin/categorias')
        })
        .catch(() => {
            req.flash('error_msg', 'Erro ao deletar a categoria.')
            res.redirect('/admin/categorias')
        })
})
//====================================

//================POSTS================
router.get('/postagens', (req, res) => {
    Post.find().populate('category')
        .sort({ date: 'desc' })
        .then(posts => {
            res.render('admin/posts', { posts: posts.map(post => post.toJSON()) })
        })
        .catch(err => {
            console.log(err)
            req.flash('error_msg', 'Falha ao listar feed')
            req.redirect('/admin')
        })
})

router.get('/postagens/add', (req, res) => {
    Category.find().then(categories => {
        res.render('admin/addPost', { categories: categories.map(category => category.toJSON()) })
    })
        .catch((err) => {
            req.flash('error_msg', "Erro ao carregar o formulário ")
            console.log(err)
        })
})

router.post('/postagens/new', (req, res) => {

    let errors = []

    if (req.body.category == "0") {
        errors.push({ text: 'Categoria inválida. Por favor, registre uma nova categoria.' })
    }

    if (errors.length > 0) {
        res.render('admin/posts', { errors: errors })
    } else {
        const newPost = {
            title: req.body.title,
            slug: req.body.slug,
            category: req.body.category,
            description: req.body.description,
            content: req.body.content
        }

        new Post(newPost).save()
            .then(() => {
                req.flash('success_msg', 'Postagem incluída com sucesso!')
                res.redirect('/admin/postagens')
            })
            .catch(() => {
                req.flash('error_msg', 'Erro ao postar. Tente novamente mais tarde.')
                res.redirect('/admin/postagens')
            })
    }
})

router.get('/postagens/update/:id', (req, res) => {
    Post.findOne({ _id: req.params.id }).lean().then(post => {
        Category.find()
            .then(categories => {
                res.render('admin/updatePost', {
                    categories: categories,
                    post: post
                })
            })
            .catch(() => {
                req.flash('error_msg', 'Não foi possível listar as categorias')
                res.redirect('/admin/postagens')
            })
    }).catch(() => req.flash('error_msg', 'Erro ao carregar formulário de edição'))
})

router.post('/postagens/update', (req, res) => {
    Post.findOne({ _id: req.body.id })
        .then(post => {

            post.title = req.body.title,
                post.slug = req.body.slug,
                post.descritption = req.body.description
            post.content = req.body.content
            post.category = req.body.category

            post.save().then(() => {
                req.flash('success_msg', 'Postagem atualizada com sucesso!')
                req.redirect('/admin/postagens')
            })
                .catch(err => {
                    consolel.log(err)
                    req.flash('error_msg', 'Erro interno')
                    res.redirect('/admin/postagens')
                })
        }).catch(err => {
            console.log(err)
            req.flash('error_msg', 'Erro ao atualizar postagem.')
            res.redirect('/admin/postagens')
        })
})

router.post('/postagens/delete', isAdmin, (req, res) => {
    Post.deleteOne({ _id: req.body.id })
        .then(() => {
            req.flash('success_msg', 'Postagem deletada com sucesso.')
            res.redirect('/admin/postagens')
        })
        .catch(() => {
            req.flash('error_msg', 'Erro ao deletar a postagem.')
            res.redirect('/admin/postagens')
        })
})



module.exports = router