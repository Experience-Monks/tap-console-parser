# tap-console-parser

[![stable](http://badges.github.io/stability-badges/dist/stable.svg)](http://github.com/badges/stability-badges)

Parses TAP by hijacking `console.log`, primarily useful for colorizing tests in the browser console.

```js
var parser = require('tap-console-parser')

// start hijacking console.log()
var tap = parser()

// we can print to the real console with log()
tap.on('assert', function (assert) {
  tap.log('Got assert!', assert.name)
})

// get result
tap.on('complete', function (result) {
  // stop hijacking console.log
  tap.detach()
  
  if (result.ok)
    console.log('Ok!')
  else
    console.log('Not ok!')
})
```

## Usage

[![NPM](https://nodei.co/npm/tap-console-parser.png)](https://www.npmjs.com/package/tap-console-parser)

#### `parser = tapConsole()`

Creates a new TAP parser and hijacks the global `console.log` function. 

#### `parser.attach()`

Hijacks the `console.log` function. Any subsequent logs will be captured by this parser and not printed to the native console.

#### `parser.detach()`

Un-hijacks the `console.log` function. Subsequent logs will not be parsed, and will be passed to the native console as usual.

#### `parser.log(args)`

The native `console.log()` function, can be used while the parser is attached to actually log something to the console.

#### `parser.on('assert', fn)`

Called when an assertion is met, see [tap-out#assert](https://github.com/scottcorgan/tap-out/blob/f38110d2201165458b3ee7adac72cbe8f385fbf4/README.md#tonassert-function-assertion-).

#### `parser.on('test', fn)`

Called when a new test block is met, see [tap-out#test](https://github.com/scottcorgan/tap-out/blob/f38110d2201165458b3ee7adac72cbe8f385fbf4/README.md#tontest-function-test-)

#### `parser.on('complete', fn)`

Called when `tests`, `fail` and `pass` have been parsed, and we can assume the test is over. The passed parameter looks like:

```js
{
  ok: false,
  total: 3,
  pass: 2,
  fail: 1
}
```

#### `parser.on('log', fn)`

Called whenever `console.log()` is called with `args`, an array of the user's arguments. It allows you to pass along logs to the native console like so:

```js
parser.on('log', function(args) {
  parser.log.apply(null, args)
})
```

## License

MIT, see [LICENSE.md](http://github.com/Jam3/tap-console-parser/blob/master/LICENSE.md) for details.
