'use strict'

const bodyParser = require('body-parser')

import express from 'express';
import line from 'node-line-bot-api';

var server = require('http').Server(app);
var io = require('socket.io')(server);

const app = express();


server.listen(80);


io.on('connection', function (socket) {
  socket.emit('news', { hello: 'world' });
  socket.on('my other event', function (data) {
    console.log(data);
  });
});

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

app.post('/webhook/', line.validator.validateSignature(), async (req, res, next) => {


    for (const event of req.body.events) {

        await line.client
            .replyMessage({
                replyToken: event.replyToken,
                messages: [{
                    type: 'text',
                    text: event.message.text + '✋'
                }]
            });
    }


    res.json({ success: true });
});

app.listen(process.env.PORT || 3000, () => {
    console.log('Example app listening on port 3000!')
})
