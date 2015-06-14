var fs = require('fs')
var path = require('path')

var file = path.join(__dirname, 'tap.txt')
var lines = fs.readFileSync(file, 'utf8').split('\n')

var test = require('tape')
var Tap = require('../')


test('can parse tap output correctly', function(t) {
  var tap = Tap()

  var asserts = []
  var tests = []
  var result

  tap.on('test', function (test) {
    tests.push(test)
  })
  tap.on('assert', function (assert) {
    asserts.push(assert)
  })

  tap.on('complete', function (r) {
    result = r
    tap.detach()
    ready()
  })

  lines.forEach(function (x) {
    console.log(x)
  })

  function ready () {
    t.test('should have some asserts', function (t) {
      t.deepEqual(asserts[0], { name: 'got true', number: 1, ok: true, raw: 'ok 1 got true', test: 1, type: 'assert' })
      t.deepEqual(asserts[1], { error: { actual: '51', at: { character: '5', file: 'basic.js', line: '5' }, expected: 'true', operator: 'equal', raw: '    operator: equal\n    expected: true\n    actual:   51\n    at: Test.<anonymous> (basic.js:5:5)' }, name: 'something wrong', number: 2, ok: false, raw: 'not ok 2 something wrong', test: 1, type: 'assert' })
      t.deepEqual(asserts[2], { error: { actual: undefined, at: undefined, expected: undefined, operator: 'fail', raw: '    operator: fail' }, name: 'test timed out after 50ms', number: 3, ok: false, raw: 'not ok 3 test timed out after 50ms', test: 2, type: 'assert' })
      t.deepEqual(tests[0], { name: 'first test', number: 1, raw: '# first test', type: 'test' })
      t.deepEqual(result, { fail: 2, ok: false, pass: 1, total: 3 })
      t.end()
    })
    t.end()
  }
})

test('console.log(undefined) does not throw', function (t) {
  var tap = Tap()
  console.log(undefined)
  tap.detach()
  t.end()
})
