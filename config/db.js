if(process.env.NODE_ENV == 'production'){
    module.exports  = {
        mongoURI: 'mongodb+srv://root:<b10g4pp_>@cluster0.fmxrg.mongodb.net/<blogapp>?retryWrites=true&w=majority'
    }
}else{
    module.exports = {
        mongoURI: 'mongodb://localhost/blog'
    }
}