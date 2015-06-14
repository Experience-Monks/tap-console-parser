var slice = require('sliced')
var through = require('through2')
var parser = require('tap-out')
var format = require('util').format
var console = global.console
var EventEmitter = require('events').EventEmitter

module.exports = function() {
  var tap = parser()
  var out = through()

  // the tap-out parser does some strange things..
  // gonna just return a simple emitter here
  var emitter = new EventEmitter()

  var results = {}
  var total = null
  var nativeMethod = console.log

  function handleResult(result) {
    if (result.name === 'tests')
      total = parseInt(result.count, 10)

    results[result.name] = result
    if (Object.keys(results).length === 3
      || (result.name !== 'tests' && parseInt(result.count, 10) === total)) {
      process.nextTick(output)
    }
  }

  function output() {
    var pass = results.pass ? parseInt(results.pass.count, 10) : 0
    var fail = results.fail ? parseInt(results.fail.count, 10) : 0
    var ok = fail === 0 && pass === total
    emitter.emit('complete', {
      ok: ok,
      total: total,
      pass: pass,
      fail: fail
    })
  }
  
  function attach() {
    console.log = function() {
      var args = slice(arguments)
      write(args)
    }
  }

  function detach() {
    console.log = nativeMethod
  }

  attach()

  out.pipe(tap)
  tap.on('result', handleResult)
  tap.on('assert', function onAssert (assert) {
    emitter.emit('assert', assert)
  })

  // hook up rest of events
  tap.on('test', emitter.emit.bind(emitter, 'test'))
  tap.on('version', emitter.emit.bind(emitter, 'version'))
  tap.on('comment', emitter.emit.bind(emitter, 'comment'))

  emitter.log = nativeMethod.bind(console)
  emitter.attach = attach
  emitter.detach = detach

  return emitter

  function write(args) {
    // ensure all args are strings
    var cleanArgs = args.map(String)

    // try parsing it as tap
    var output = format.apply(null, cleanArgs)
    out.write(output+'\n')

    // capture the logs but allow user to act on them
    emitter.emit('log', args)
  }
}