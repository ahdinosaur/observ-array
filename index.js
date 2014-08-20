var Observ = require("observ")
var Immutable = require("immutable")

// circular dep between ArrayMethods & this file
module.exports = ObservArray

var ArrayMethods = require("./array-methods.js")
var addListener = require("./add-listener.js")


/*  ObservArray := (Array<T>) => Observ<
        Array<T> & { _diff: Array }
    > & {
        splice: (index: Number, amount: Number, rest...: T) =>
            Array<T>,
        push: (values...: T) => Number,
        filter: (lambda: Function, thisValue: Any) => Array<T>,
        indexOf: (item: T, fromIndex: Number) => Number
    }

    Fix to make it more like ObservHash.

    I.e. you write observables into it. 
        reading methods take plain JS objects to read
        and the value of the array is always an array of plain
        objsect.

        The observ array instance itself would have indexed 
        properties that are the observables
*/
function ObservArray(initialList) {
    var vector = Immutable.Vector.from(initialList);

    // copy state out of initialList into initialState
    var initialState = Immutable.Vector.from(
      initialList.map(function (observ, index) {
        return typeof observ === "function" ?
          observ() : observ
      })
    )

    var obs = Observ(initialState)

    obs._vector = vector
    
    obs._obsSet = obs.set
    obs = ArrayMethods(obs, vector)
    obs._arraySet = obs.set

    obs.set = set

    var removeListeners = vector.map(function (observ) {
        return typeof observ === "function" ?
            addListener(obs, observ) :
            null
    });
    // this is a list of removal functions that must be called
    // when observ instances are removed from `obs.list`
    // not calling this means we do not GC our observ change
    // listeners. Which causes rage bugs
    obs._removeListeners = removeListeners

    return obs
}

function set() {
    if (arguments.length == 1) {
      this._obsSet.apply(this, arguments)
    } else {
      this._arraySet.apply(this, arguments)
    }
    return this._list[index]
}

function getLength() {
    return this._list.length
}
