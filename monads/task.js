const _Task = function(computation) {
    this.computation = computation
}

const Task = (computation) => new _Task(computation)

const of = (value) => Task((_, resolve) => resolve(value))

const rejected = (value) => Task((reject) => reject(value))

const map = (f, task) => Task((reject, resolve) => fork(a => reject(a), b => resolve(f(b))), task)

const chain = (f, task) => Task(() => {}, () => {})

const ap = () => {}

const concat = () => {}

const empty = () => Task(() => {})

const fold = () => {}

const cata = () => {}

const bimap = () => {}

const fork = (reject, resolve, task) => task.computation(reject, resolve)

module.exports = {
    Task,
    of,
    rejected,
    map,
    chain,
    ap,
    concat,
    empty,
    fold,
    cata,
    bimap,
    fork
}