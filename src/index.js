'use strict'

const bodyParser = require('body-parser')

import express from 'express';
import line from 'node-line-bot-api';

const app = express();

const server = require('http').Server(app);
const io = require('socket.io')(server);




// need raw buffer for signature validation
app.use(bodyParser.json({
    verify(req, res, buf) {
        req.rawBody = buf
    }
}))

// ゲームのクライアント
// 複数のクライアントがある場合、最後に開かれたクライアントを使用する
let mainSocket = null;

io.on('connection', (socket) => {

    mainSocket = socket;

    socket.on('disconnect', () => {

        if (mainSocket === socket) socket = null;

    });

    /*
        socket.emit('news', { hello: 'world' });
        socket.on('my other event', function(data) {
            console.log(data);
        });
        */
});





// init with auth
line.init({
    accessToken: 'YvxY4DWjIekWDwr5VBIlkjCYecAV5F6JZmUxCgnDA1an2QlEAENe5E3EV9R+EdJpmaKTY0v2uILRv3WvkhdRBPoYMRJnYpRbBn284lJawJDD384dvmyl6phkyXAnsoa5g8Ru+XDxLMkRXtzxVYB29gdB04t89/1O/w1cDnyilFU=',
    // (Optional) for webhook signature validation
    channelSecret: '1d360dcb6469254599ab19c5372e7f94'
});



const imageTest = async(event, res) => {



    try {


        const content = await line.client.getMessageContent(event.message.id);


        await line.client.replyMessage({
            replyToken: event.replyToken,
            messages: [{
                type: 'text',
                text: 'image: ' + JSON.stringify(content)
            }]
        });


        res.json({ success: true });


    } catch (e) {

        console.log(e);

    }


    /*
        line.client
            .getMessageContent('xxxxxxxxxx' /* messageId  )
            .then((content) => {
                // handle content
            })

    */
};





app.post('/webhook/', line.validator.validateSignature(), async(req, res, next) => {

    // ゲーム画面が存在しない
    if (!mainSocket) return res.json({ success: true });

    for (const event of req.body.events) {

        if (event.message.type === 'image') return imageTest(event, res);


        if (event.message.type !== 'text') continue;

        // ゲームに式を送る
        mainSocket.emit('eval', event.message.text);

        // 結果を待つ
        const result = await new Promise((resolve) => {

            mainSocket.on('eval', (data) => {
                // 結果を返す
                resolve(data);
            });

        });

        await line.client.replyMessage({
            replyToken: event.replyToken,
            messages: [{
                type: 'text',
                text: result
            }]
        });

    }

    res.json({ success: true });

});

/*
app.listen(process.env.PORT || 3000, () => {
    console.log('Example app listening on port 3000!')
});
*/

server.listen(process.env.PORT || 3000, function() {
    console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
});
