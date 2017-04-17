'use strict'
const line = require('node-line-bot-api')
const express = require('express')
const bodyParser = require('body-parser')
const app = express()

// need raw buffer for signature validation
app.use(bodyParser.json({
    verify(req, res, buf) {
        req.rawBody = buf
    }
}))

// init with auth
line.init({
    accessToken: 'YvxY4DWjIekWDwr5VBIlkjCYecAV5F6JZmUxCgnDA1an2QlEAENe5E3EV9R+EdJpmaKTY0v2uILRv3WvkhdRBPoYMRJnYpRbBn284lJawJDD384dvmyl6phkyXAnsoa5g8Ru+XDxLMkRXtzxVYB29gdB04t89/1O/w1cDnyilFU=',
    // (Optional) for webhook signature validation
    channelSecret: '1d360dcb6469254599ab19c5372e7f94'
})

app.post('/webhook/', line.validator.validateSignature(), (req, res, next) => {
    // get content from request body
    const promises = req.body.events.map(event => {
        // reply message
        return line.client
            .replyMessage({
                replyToken: event.replyToken,
                messages: [{
                    type: 'text',
                    text: event.message.text
                }]
            })
    })
    Promise
        .all(promises)
        .then(() => res.json({ success: true }))
})

app.listen(process.env.PORT || 3000, () => {
    console.log('Example app listening on port 3000!')
})
