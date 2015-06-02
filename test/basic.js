var test = require('tape')

test('first test', function (t) {
  t.ok(true, 'got true')
  t.equal(51, true, 'something wrong')
  t.end()
})

test('second test', function (t) {
  t.plan(1)
  t.timeoutAfter(50)
})