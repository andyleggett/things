const {Observable, subscribe, map, filter, merge, chain, reduce} = require('../monads/observable.js')

const {identity, compose, curry} = require('ramda')

const counterObserver = observer => {
    let counter = 0
    const interval = setInterval(() => {
        observer.next(counter++)
    }, 1000)

    return () => clearInterval(interval)
}

const delayObserver = curry((value, delay) => observer => {
    const timeout = setTimeout(() => {
        observer.next(value)
    }, delay)

    return () => clearTimeout(timeout)
})

let vals1 = Observable(counterObserver)

let vals2 = compose(reduce((acc, val) => acc + ' ' + val, ''), map(val => 'Value after delay - ' + val), chain(val => Observable(delayObserver(val, 3000))), map(val => val * val))(Observable(counterObserver))

let merged = merge([vals1, vals2])

const unsubscribe = subscribe({
    next: console.log
}, vals2)

setTimeout(() => unsubscribe(), 20000)