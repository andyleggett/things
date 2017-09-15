const _Left = function (a) {
    this.value = a
}

const Left = (a) => new _Left(a)

const _Right = function (a) {
    this.value = a
}

const Right = (a) => new _Right(a)

const isLeft = (either) => either instanceof _Left

const isRight = (either) => either instanceof _Right

const fromNullable = (a) => a !== null ? Right(a) : Left(a)

const of = (a) => Right(a)

const ap = (b) => (either) => isLeft(either) ? either : map(b, either.value)

const map = (f) => (either) => isLeft(either) ? of(either.value) : of(f(either.value))

const chain = (f) => (either) => isLeft(either) ? () => {} : f(either.value)

const get = (either) => isRight(either) ? either.value : undefined

const getOrElse = (value) => (either) => isRight(either) ? either.value : value

const fold = (f, g) => (either) => isRight(either) ? g(either.value) : f(either.value)

export {
    Left,
    Right,
    isLeft,
    isRight,
    fromNullable,
    of,
    map,
    chain,
    get,
    getOrElse,
    fold
}