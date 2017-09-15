const _Just = function (a) {
    this.value = a
}

const Just = (a) => new _Just(a)

const _None = function () {}

const None = () => new _None()

const isJust = (maybe) => maybe instanceof _Just

const isNone = (maybe) => maybe instanceof _None

const fromNullable = (a) => a !== null ? Just(a) : None()

const of = (a) => Just(a)

const map = (f) => (maybe) => isNone(maybe) ? None() : of(f(maybe.value))

const chain = (f) => (maybe) => isNone(maybe) ? None() : f(maybe.value)

export {
    Just,
    None,
    isJust,
    isNone,
    fromNullable,
    of,
    map,
    chain
}