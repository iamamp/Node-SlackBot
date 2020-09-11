const express = require('express')
const morgan = require('morgan')
const multer  = require('multer')
const file = multer({ dest: 'uploads/' })

const PORT = process.env.PORT || 8080; //use 8080 or use whatever Heroku gives you
const { channels, upload } = require('./controller')

const app = express()
app.use(morgan('dev'))
app.use(express.json())

app.get('/api/channels', channels) //get a list of channels in the workspace

app.post('/api/upload', file.single('image'), upload) //to post pictures to a channel in our workspace

app.get('*', function(req, res){
    res.status(404).send({ "error":"invalid route" })
})

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`)
})