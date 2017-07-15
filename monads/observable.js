const { assoc, append, curry, forEach, compose, map: mapList } = require('ramda')

const _Observable = function (subscribe) {
    this.subscribe = subscribe
}

const Observable = (subscribe) => new _Observable(subscribe)

const isObservable = (observable) => observable instanceof _Observable

const subscribe = curry((observer, observable) => observable.subscribe(observer))

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

const callAll = (fns) => () => forEach((fn) => fn())(fns)

const merge = (observables) => {
    return Observable(observer => {
        const mergeObserver = {
            next: (value) => observer.next(value),
            error: (err) => observer.error(err),
            complete: () => observer.complete()
        }

        const innerSubscriptions = compose(callAll, mapList(subscribe(mergeObserver)))(observables)

        return innerSubscriptions
    })
}

const chain = curry((f, observable) => {
    return Observable(observer => {
        let subscriptions = []

        const outerSubscription = subscribe({
            next: (value) => {
                const innerObservable = f(value)

                const innerSubscription = subscribe({
                    next: (value) => observer.next(value),
                    error: (err) => observer.error(err),
                    complete: () => observer.complete()
                }, innerObservable)

                subscriptions = append(innerSubscription, subscriptions)

            },
            error: (err) => observer.error(err),
            complete: () => observer.complete()

        }, observable)

        subscriptions = append(outerSubscription, subscriptions)

        return callAll(subscriptions)
    })
})

const reduce = curry((f, seed, observable) => {
    let acc = seed

    return Observable(observer => {
        const reduceObserver = {
            next: (value) => observer.next(acc = f(acc, value)),
            error: (err) => observer.error(err),
            complete: () => observer.complete()
        }

        return subscribe(reduceObserver, observable)
    })
})

module.exports = {
    Observable,
    isObservable,
    subscribe,
    map,
    filter,
    merge,
    chain,
    reduce
}