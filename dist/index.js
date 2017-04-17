'use strict';

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var line = require('node-line-bot-api');
var express = require('express');
var bodyParser = require('body-parser');
var app = express();

// need raw buffer for signature validation
app.use(bodyParser.json({
    verify: function verify(req, res, buf) {
        req.rawBody = buf;
    }
}));

// init with auth
line.init({
    accessToken: 'YvxY4DWjIekWDwr5VBIlkjCYecAV5F6JZmUxCgnDA1an2QlEAENe5E3EV9R+EdJpmaKTY0v2uILRv3WvkhdRBPoYMRJnYpRbBn284lJawJDD384dvmyl6phkyXAnsoa5g8Ru+XDxLMkRXtzxVYB29gdB04t89/1O/w1cDnyilFU=',
    // (Optional) for webhook signature validation
    channelSecret: '1d360dcb6469254599ab19c5372e7f94'
});

app.post('/webhook/', line.validator.validateSignature(), function (req, res, next) {
    // get content from request body
    var promises = req.body.events.map(function (event) {
        // reply message
        return line.client.replyMessage({
            replyToken: event.replyToken,
            messages: [{
                type: 'text',
                text: event.message.text
            }]
        });
    });
    _promise2.default.all(promises).then(function () {
        return res.json({ success: true });
    });
});

app.listen(process.env.PORT || 3000, function () {
    console.log('Example app listening on port 3000!');
});