const _Task = function(computation) {
    this.computation = computation
}

const Task = (computation) => new _Task(computation)

const of = (value) => Task((_, resolve) => resolve(value))

const rejected = (value) => Task((reject) => reject(value))

const map = (f, task) => Task((reject, resolve) => fork(a => reject(a), b => resolve(f(b)), task))

const chain = (f, task) => Task((reject, resolve) => fork(a => reject(a), b => fork(reject, resolve, f(b)), task))

const ap = (taskf, taskx) => Task((reject, resolve) => {
    let value
    let valueSet = false
    let func
    let funcSet = false

    const resolver = (setter) => (x) => {
        setter(x)
        if (valueSet === true && funcSet === true){
            return resolve(func(value))
        }
    }

    const statex = fork(reject, resolver((x) => {
        value = x
        valueSet = true
    }), taskx)

    const statef = fork(reject, resolver((f) => {
        func = f
        funcSet = true
    }), taskf)

    return [statex, statef]
})

const concat = (concattask, task) => Task((reject, resolve) => {
    const state = fork(reject, resolve, task)
    const stateconcat = fork(reject, resolve, taskconcat)

    return [state, stateconcat]
})

const empty = () => Task(() => {})

const fold = (f, g, task) => Task((_, resolve) => fork(a => resolve(f(a)), b => resolve(g(b))), task)

const cata = (pattern, task) => fold(pattern.rejected, pattern.resolved, task)

const bimap = (f, g) => Task((reject, resolve) => fork(a => reject(f(a)), b => resolve(g(b))), task)

const sequence = (tasks) => Task((reject, resolve) => {
    let results = []
    let count = 0
    let done = false

    addIndex(forEach)((task, index) => {
        fork(
            (err) => {
                if (done === false){
                    done = true
                    reject(err)
                }
            },
            (result) => {
                results[index] = result
                count += 1
                if (count === tasks.length){
                    resolve(results)
                }
            },
            task
        )
    }, tasks)
})

const fork = (reject, resolve, task) => task.computation(reject, resolve)

export {
    Task,
    of,
    rejected,
    map,
    chain,
    ap,
    concat,
    sequence,
    empty,
    fold,
    cata,
    bimap,
    fork
}