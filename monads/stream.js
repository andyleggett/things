import {assoc, append, curry} from 'ramda'

const _Stream = function (initialvalue) {
    this.value = initialvalue
    this.values = [initialvalue]
    this.observers = []
}

const Stream = (initialvalue) => new _Stream(initialvalue)

const isStream = (stream) => stream instanceof _Stream

const subscribe = (observer, stream) => assoc('observers', append(observer, stream.observers))

const next = (value, stream) => {
    stream.value = value
    stream.values.push(value)

    forEach(observer => observer.next(value))(stream.observers)
}

/*const combine = (f, streams) => {

}



const map = curry((f, stream) => {

})

const merge = (stream1, stream2) => {

}*/

export {
    Stream,
    isStream,
    subscribe,
    next,
    map
}