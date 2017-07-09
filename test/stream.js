const {Stream, next, subscribe, isStream} = require('../monads/stream.js')

let vals = Stream(13)

vals = subscribe({
    next: console.log
}, vals)

console.log(vals)

//console.log(next(12, vals))