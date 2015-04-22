'use strict';

var assert = require('assert');
var waitFor = require('../');

describe('waitFor', function () {

  function assertReadyMessage (opts, cb) {

    if (arguments.length === 1) {
      cb = opts;
      opts = null;
    }

    var port = opts ? opts.port : 1337;

    var WebSocketServer = require('ws').Server,
        wss = new WebSocketServer({ port: port });

    wss.on('connection', function (ws) {
      ws.on('message', function (msg) {
        assert.strictEqual(msg, 'ready');
        wss.close();
        cb();
      });
    });

  }

  it('should test the ready function without parameters', function (cb) {
    assertReadyMessage(cb);
    waitFor.ready();
  });

  it('should test the ready function with a callback', function (cb) {
    assertReadyMessage(cb);
    waitFor.ready(function (err) {
      assert.strictEqual(!!err, false);
    });
  });

  it('should test the ready function with a promise', function (cb) {
    assertReadyMessage(cb);
    waitFor.ready().then(function (err) {
      assert.strictEqual(!!err, false);
    });
  });

  it('should test the ready function with an optional port', function (cb) {
    assertReadyMessage({ port: 1336 }, cb);
    waitFor.ready({ port: 1336 }, function (err) {
      assert.strictEqual(!!err, false);
    });
  });

  it('should try to connect to a wrong port', function (cb) {

    assertReadyMessage({ port: 1336 }, cb);

    waitFor.ready(function (err) {
      assert.strictEqual(err.code, 'ECONNREFUSED');
    }).catch(function (err) {
      assert.strictEqual(err.code, 'ECONNREFUSED');
      cb();
    });

  });

  it('should wait for something using a callback', function (cb) {

    waitFor.wait(function (err) {
      assert.strictEqual(!!err, false);
      cb();
    });

    setTimeout(function () {
      waitFor.ready();
    }, 142);

  });

  it('should wait for something using a promise', function (cb) {

    waitFor.wait().then(function (err) {
      assert.strictEqual(!!err, false);
      cb();
    });

    setTimeout(function () {
      waitFor.ready();
    }, 142);

  });

  it('should wait for something using options and callback', function (cb) {

    waitFor.wait({ port: 1334 }, function (err) {
      assert.strictEqual(!!err, false);
      cb();
    });

    setTimeout(function () {
      waitFor.ready({ port: 1334 });
    }, 142);

  });

  it('should wait for something using options and promise', function (cb) {

    waitFor.wait({ port: 1664 }).then(function (err) {
      assert.strictEqual(!!err, false);
      cb();
    });

    setTimeout(function () {
      waitFor.ready({ port: 1664 });
    }, 142);

  });

  it('should wait for something using options, promise and callback', function (cb) {

    waitFor.wait({ port: 1664 }, function (err) {
      assert.strictEqual(!!err, false);
    }).then(function (err) {
      assert.strictEqual(!!err, false);
      cb();
    });

    setTimeout(function () {
      waitFor.ready({ port: 1664 });
    }, 142);

  });

});
