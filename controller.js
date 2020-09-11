const axios = require('axios')
const fs = require('fs')
const FormData = require('form-data')
const readChunk = require('read-chunk')

const botToken = "xoxb-1338537310326-1345319737250-QkvHOJWXKlXgPYIUuql5ANTy"
var list = []

const channels = (req, res) => {
    axios.post(`https://slack.com/api/conversations.list?token=${botToken}`)
    .then((response) => {
        //console.log(response.data.channels)
        list = response.data.channels.map(ch => ch.id)
        console.log(list)
        res.status(200).send({  
            list: list,
        })
    })
}

const upload = (req, res) => {
    console.log(req.file)
    const channel = req.body.channel
    //console.log(channel)
    axios.post(`https://slack.com/api/conversations.join?token=${botToken}&channel=${channel}`)
    .then(() => {
        console.log('\n\n')
        
        var file = fs.createReadStream(req.file.path)
        console.log(file) 
        console.log('\n\n')
        
        //const buffer = readChunk.sync(file, 0, 12)
        //console.log(imageType(file))
        //if(imageType(buffer) === null) throw "Not an image"

        if(req.file.mimetype.substring(0,5) !== 'image') throw "Not an image"

        var bodyFormData = new FormData();
        bodyFormData.append('channels', channel)
        bodyFormData.append('file', file)
        bodyFormData.append('token', botToken)
        bodyFormData.append('filename', req.file.originalname)
        bodyFormData.append('title', "botUpload")

        axios.post('https://slack.com/api/files.upload', bodyFormData, {
            headers: bodyFormData.getHeaders() //THIS is the fix
        })
    })
    .then((response)=> {
        res.status(200).send('file uploaded!')
    })
    .catch(error => {
        console.log(error)
        res.status(500).send({
          error: error
        })
    })
}

module.exports = {
    channels, upload
}