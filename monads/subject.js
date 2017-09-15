import {
    append,
    forEach,
    reject,
    equals
} from 'ramda'

const _Subject = function () {
    this.observers = []
}

const Subject = () => new _Subject()

const subscribe = (observer, subject) => {
    subject.observers = append(observer, subject.observers)

    const subscription = () => {
        subject.observers = reject(equals(observer))(subject.observers)
    }

    return subscription
}

const next = (value, subject) => {
    forEach(observer => observer.next(value))(subject.observers)
}

const error = (error, subject) => {
    forEach(observer => observer.error(error))(subject.observers)
}

const complete = (subject) => {
    forEach(observer => observer.complete())(subject.observers)
}

export {
    Subject,
    subscribe,
    next,
    error,
    complete
}