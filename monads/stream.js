const {assoc, append, curry, forEach} = require('ramda')

const _Stream = function (value, values, observers) {
    this.value = value
    this.values = append(value, values || [])
    this.observers = observers || []
}

const Stream = (initialvalue) => new _Stream(initialvalue)

const isStream = (stream) => stream instanceof _Stream

const subscribe = (observer, stream) => {

    return Stream(stream.value, stream.values, append(observer, stream.observers))
}

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

module.exports = {
    Stream,
    isStream,
    subscribe,
    next
}