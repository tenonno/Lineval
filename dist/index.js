"use strict";

var _regenerator = require("babel-runtime/regenerator");

var _regenerator2 = _interopRequireDefault(_regenerator);

var _promise = require("babel-runtime/core-js/promise");

var _promise2 = _interopRequireDefault(_promise);

var _asyncToGenerator2 = require("babel-runtime/helpers/asyncToGenerator");

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

(0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee() {
    return _regenerator2.default.wrap(function _callee$(_context) {
        while (1) {
            switch (_context.prev = _context.next) {
                case 0:

                    console.log(1);

                    _context.next = 3;
                    return new _promise2.default(function (resolve) {
                        return setTimeout(resolve, 3000);
                    });

                case 3:

                    console.log(2);

                case 4:
                case "end":
                    return _context.stop();
            }
        }
    }, _callee, this);
}))();