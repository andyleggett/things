const {Observable, subscribe, map, filter, merge, chain, reduce, scan} = require('../monads/observable.js')

const {identity, compose, curry} = require('ramda')

const counterObserver = count => observer => {
    let counter = 1
    
    const interval = setInterval(() => {
        if (counter <= count){
            observer.next(counter++)
        } else {
            observer.complete()
            clearInterval(interval)
        }
    }, 1000)

    return () => clearInterval(interval)
}

const delayObserver = (value, delay) => observer => {
    const timeout = setTimeout(() => {
        observer.next(value)
        observer.complete()
    }, delay)

    return () => clearTimeout(timeout)
}

let vals1 = reduce((acc, val) => acc + ' ' + val, '')(Observable(counterObserver(5)))

let vals2 = compose(reduce((acc, val) => acc + ' ' + val, ''), map(val => 'Value after delay - ' + val), chain(val => Observable(delayObserver(val, 10000))), map(val => val * val))(Observable(counterObserver(10)))

let vals3 = Observable(counterObserver(20))

let merged = merge([vals1, vals2, vals3])

const unsubscribe = subscribe({
    next: console.log,
    error: console.log,
    complete: () => console.log('completed')
}, merged)

//setTimeout(() => unsubscribe(), 20000)