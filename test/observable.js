const {Observable, subscribe, map, filter} = require('../monads/observable.js')

const {identity, compose} = require('ramda')

let vals = Observable((observer) => {
    let counter = 0
    let interval = setInterval(() => {
        observer.next(counter++)
    }, 1000)

    return () => clearInterval(interval)
})

vals = compose(filter((val) => val % 2 === 0), map((val) => val * val))(vals)

const unsubscribe = subscribe({
    next: console.log
}, vals)

setTimeout(() => unsubscribe(), 20000)