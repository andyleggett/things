import {
    append,
    curry,
    forEach,
    map as listMap,
    reject,
    equals
} from 'ramda'

const _Observable = function (subscribe) {
    this.subscribe = subscribe
}

const Observable = (subscribe) => new _Observable(subscribe)

const isObservable = (observable) => observable instanceof _Observable

const subscribe = curry((observer, observable) => observable.subscribe(observer))

const of = (value) => Observable((observer) => observer.next(value))

const delay = curry((duration, observable) => {
    return Observable((observer) => {
        const delayObserver = {
            next: (value) => {
                setTimeout(() => observer.next(value), duration)
            },
            error: (err) => observer.error(err),
            complete: () => observer.complete()
        }

        return subscribe(delayObserver, observable)
    })
})

const map = curry((f, observable) => {
    return Observable((observer) => {
        const mapObserver = {
            next: (value) => observer.next(f(value)),
            error: (err) => observer.error(err),
            complete: () => observer.complete()
        }

        return subscribe(mapObserver, observable)
    })
})

const filter = curry((f, observable) => {
    return Observable((observer) => {
        const filterObserver = {
            next: (value) => {
                if (f(value) === true) {
                    observer.next(value)
                }
            },
            error: (err) => observer.error(err),
            complete: () => observer.complete()
        }

        return subscribe(filterObserver, observable)
    })
})

const callAll = (fns) => () => forEach((fn) => fn())(fns)

const merge = (observables) => {
    return Observable((observer) => {
        let subscriptions = []

        const checkComplete = () => {
            if (subscriptions.length === 0) {
                observer.complete()
            }
        }

        const innerSubscriptions = listMap(observable => {
            const mergeObserver = {
                next: (value) => observer.next(value),
                error: (err) => observer.error(err),
                complete: () => {
                    subscriptions = reject(equals(innerSubscription))(subscriptions)
                    checkComplete()
                }
            }

            const innerSubscription = subscribe(mergeObserver, observable)
            subscriptions = append(innerSubscription, subscriptions)
        })(observables)

        return innerSubscriptions
    })
}

const chain = curry((f, observable) => {
    return Observable((observer) => {
        let subscriptions = []
        let outerComplete = false

        const checkComplete = () => {
            if (outerComplete === true && subscriptions.length === 0) {
                observer.complete()
            }
        }

        const outerSubscription = subscribe({
            next: (value) => {
                const innerObservable = f(value)

                const innerSubscription = subscribe({
                    next: (value) => observer.next(value),
                    error: (err) => observer.error(err),
                    complete: () => {
                        subscriptions = reject(equals(innerSubscription))(subscriptions)
                        checkComplete()
                    }
                }, innerObservable)

                subscriptions = append(innerSubscription, subscriptions)
            },
            error: (err) => observer.error(err),
            complete: () => {
                outerComplete = true
                checkComplete()
            }
        }, observable)

        return callAll(append(outerSubscription, subscriptions))
    })
})

const scan = curry((f, seed, observable) => {
    let acc = seed

    return Observable((observer) => {
        const scanObserver = {
            next: (value) => {
                acc = f(acc, value)
                observer.next(acc)
            },
            error: (err) => observer.error(err),
            complete: () => observer.complete()
        }

        return subscribe(scanObserver, observable)
    })
})

const reduce = curry((f, seed, observable) => {
    let acc = seed

    return Observable((observer) => {
        const reduceObserver = {
            next: (value) => {
                acc = f(acc, value)
            },
            error: (err) => observer.error(err),
            complete: () => {
                observer.next(acc)
                observer.complete()
            }
        }

        return subscribe(reduceObserver, observable)
    })
})

export {
    Observable,
    isObservable,
    subscribe,
    of ,
    delay,
    map,
    filter,
    merge,
    chain,
    reduce,
    scan
}