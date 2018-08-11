if (process.env.NODE_ENV === 'production') {
    module.exports = {
        mongoURI: 'mongodb://sagarsehwag:Mlab@0026@ds119422.mlab.com:19422/vidjot-prod'
    }
} else {
    module.exports = {
        mongoURI: 'mongodb://localhost:27017/vidjot'
    }
}