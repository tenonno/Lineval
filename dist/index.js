'use strict';

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _getIterator2 = require('babel-runtime/core-js/get-iterator');

var _getIterator3 = _interopRequireDefault(_getIterator2);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _nodeLineBotApi = require('node-line-bot-api');

var _nodeLineBotApi2 = _interopRequireDefault(_nodeLineBotApi);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var bodyParser = require('body-parser');

var app = (0, _express2.default)();

var server = require('http').Server(app);
var io = require('socket.io')(server);

// need raw buffer for signature validation
app.use(bodyParser.json({
    verify: function verify(req, res, buf) {
        req.rawBody = buf;
    }
}));

// ゲームのクライアント
// 複数のクライアントがある場合、最後に開かれたクライアントを使用する
var mainSocket = null;

io.on('connection', function (socket) {

    mainSocket = socket;

    socket.on('disconnect', function () {

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
_nodeLineBotApi2.default.init({
    accessToken: 'YvxY4DWjIekWDwr5VBIlkjCYecAV5F6JZmUxCgnDA1an2QlEAENe5E3EV9R+EdJpmaKTY0v2uILRv3WvkhdRBPoYMRJnYpRbBn284lJawJDD384dvmyl6phkyXAnsoa5g8Ru+XDxLMkRXtzxVYB29gdB04t89/1O/w1cDnyilFU=',
    // (Optional) for webhook signature validation
    channelSecret: '1d360dcb6469254599ab19c5372e7f94'
});

var imageTest = function imageTest(event) {

    /*
        line.client
            .getMessageContent('xxxxxxxxxx' /* messageId  )
            .then((content) => {
                // handle content
            })
      */
};

app.post('/webhook/', _nodeLineBotApi2.default.validator.validateSignature(), function () {
    var _ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(req, res, next) {
        var _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, event, result;

        return _regenerator2.default.wrap(function _callee$(_context) {
            while (1) {
                switch (_context.prev = _context.next) {
                    case 0:
                        if (mainSocket) {
                            _context.next = 2;
                            break;
                        }

                        return _context.abrupt('return', res.json({ success: true }));

                    case 2:
                        _iteratorNormalCompletion = true;
                        _didIteratorError = false;
                        _iteratorError = undefined;
                        _context.prev = 5;
                        _iterator = (0, _getIterator3.default)(req.body.events);

                    case 7:
                        if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
                            _context.next = 21;
                            break;
                        }

                        event = _step.value;


                        if (event.message.type === 'image') imageTest(event);

                        if (!(event.message.type !== 'text')) {
                            _context.next = 12;
                            break;
                        }

                        return _context.abrupt('continue', 18);

                    case 12:

                        // ゲームに式を送る
                        mainSocket.emit('eval', event.message.text);

                        // 結果を待つ
                        _context.next = 15;
                        return new _promise2.default(function (resolve) {

                            mainSocket.on('eval', function (data) {
                                // 結果を返す
                                resolve(data);
                            });
                        });

                    case 15:
                        result = _context.sent;
                        _context.next = 18;
                        return _nodeLineBotApi2.default.client.replyMessage({
                            replyToken: event.replyToken,
                            messages: [{
                                type: 'text',
                                text: result
                            }]
                        });

                    case 18:
                        _iteratorNormalCompletion = true;
                        _context.next = 7;
                        break;

                    case 21:
                        _context.next = 27;
                        break;

                    case 23:
                        _context.prev = 23;
                        _context.t0 = _context['catch'](5);
                        _didIteratorError = true;
                        _iteratorError = _context.t0;

                    case 27:
                        _context.prev = 27;
                        _context.prev = 28;

                        if (!_iteratorNormalCompletion && _iterator.return) {
                            _iterator.return();
                        }

                    case 30:
                        _context.prev = 30;

                        if (!_didIteratorError) {
                            _context.next = 33;
                            break;
                        }

                        throw _iteratorError;

                    case 33:
                        return _context.finish(30);

                    case 34:
                        return _context.finish(27);

                    case 35:

                        res.json({ success: true });

                    case 36:
                    case 'end':
                        return _context.stop();
                }
            }
        }, _callee, undefined, [[5, 23, 27, 35], [28,, 30, 34]]);
    }));

    return function (_x, _x2, _x3) {
        return _ref.apply(this, arguments);
    };
}());

/*
app.listen(process.env.PORT || 3000, () => {
    console.log('Example app listening on port 3000!')
});
*/

server.listen(process.env.PORT || 3000, function () {
    console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
});