'use strict';

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _stringify = require('babel-runtime/core-js/json/stringify');

var _stringify2 = _interopRequireDefault(_stringify);

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

io.on('connection', function (socket) {

    // 接続開始カスタムイベント(接続元ユーザを保存し、他ユーザへ通知)
    socket.on("connected", function (name) {
        var msg = name + "が入室しました";
        userHash[socket.id] = name;
        io.sockets.emit("publish", { value: msg });
    });

    socket.emit('news', { hello: 'world' });
    socket.on('my other event', function (data) {
        console.log(data);
    });
});

// init with auth
_nodeLineBotApi2.default.init({
    accessToken: 'YvxY4DWjIekWDwr5VBIlkjCYecAV5F6JZmUxCgnDA1an2QlEAENe5E3EV9R+EdJpmaKTY0v2uILRv3WvkhdRBPoYMRJnYpRbBn284lJawJDD384dvmyl6phkyXAnsoa5g8Ru+XDxLMkRXtzxVYB29gdB04t89/1O/w1cDnyilFU=',
    // (Optional) for webhook signature validation
    channelSecret: '1d360dcb6469254599ab19c5372e7f94'
});

app.post('/webhook/', _nodeLineBotApi2.default.validator.validateSignature(), function () {
    var _ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(req, res, next) {
        var _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, event;

        return _regenerator2.default.wrap(function _callee$(_context) {
            while (1) {
                switch (_context.prev = _context.next) {
                    case 0:
                        _iteratorNormalCompletion = true;
                        _didIteratorError = false;
                        _iteratorError = undefined;
                        _context.prev = 3;
                        _iterator = (0, _getIterator3.default)(req.body.events);

                    case 5:
                        if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
                            _context.next = 12;
                            break;
                        }

                        event = _step.value;
                        _context.next = 9;
                        return _nodeLineBotApi2.default.client.replyMessage({
                            replyToken: event.replyToken,
                            messages: [{
                                type: 'text',
                                text: (0, _stringify2.default)(event)
                            }]
                        });

                    case 9:
                        _iteratorNormalCompletion = true;
                        _context.next = 5;
                        break;

                    case 12:
                        _context.next = 18;
                        break;

                    case 14:
                        _context.prev = 14;
                        _context.t0 = _context['catch'](3);
                        _didIteratorError = true;
                        _iteratorError = _context.t0;

                    case 18:
                        _context.prev = 18;
                        _context.prev = 19;

                        if (!_iteratorNormalCompletion && _iterator.return) {
                            _iterator.return();
                        }

                    case 21:
                        _context.prev = 21;

                        if (!_didIteratorError) {
                            _context.next = 24;
                            break;
                        }

                        throw _iteratorError;

                    case 24:
                        return _context.finish(21);

                    case 25:
                        return _context.finish(18);

                    case 26:

                        res.json({ success: true });

                    case 27:
                    case 'end':
                        return _context.stop();
                }
            }
        }, _callee, undefined, [[3, 14, 18, 26], [19,, 21, 25]]);
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