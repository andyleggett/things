//const {Observable, subscribe, map, filter, merge, chain, reduce, scan} = require('../monads/observable.js')
const {Subject, subscribe, next, error, complete} = require('../monads/subject.js')

const subject = Subject()

const subscription = subscribe({
    next: (value) => console.log(value),
    error: (error) => console.log(error),
    complete: () => console.log('complete')
}, subject)

next(1, subject)
subscription()
next(2, subject)
complete(subject)

