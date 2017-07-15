const {assoc, append, curry, forEach, compose} = require('ramda')

const _Observable = function (subscribe) {
    this.subscribe = subscribe
}

const Observable = (subscribe) => new _Observable(subscribe)

const isObservable = (observable) => observable instanceof _Observable

const subscribe = (observer, observable) => observable.subscribe(observer)

const map = curry((f, observable) => {
    return Observable(observer => {
        const mapObserver = {
        next: (value) => observer.next(f(value)),
        error: (err) => observer.error(err),
        complete: () => observer.complete()
        }
    
        return subscribe(mapObserver, observable)
    })
})

const filter = curry((f, observable) => {
    return Observable(observer => {
        const filterObserver = {
        next: (value) => {
            if (f(value) === true) { observer.next(value) }
        },
        error: (err) => observer.error(err),
        complete: () => observer.complete()
        }
    
        return subscribe(filterObserver, observable)
    })
})

module.exports = {
    Observable,
    isObservable,
    subscribe,
    map,
    filter
}