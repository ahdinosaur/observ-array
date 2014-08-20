var ObservArray = require("./index.js")

var slice = Array.prototype.slice

var ARRAY_METHODS = [
    "get","set",
    "count", "join", "reduce", "reduceRight", "every", "some",
    "toString", "find", "findKey", "findLast", "findLastKey",
    "flip", "map", "mapKeys", "filter", "slice", "forEach",
    "indexOf", "lastIndexOf", "findIndex", "findLastIndex",
    "splice", "concat", "reverse",
    "take", "takeLast", "takeWhile", "takeUntil",
    "skip", "skipLast", "skipWhile", "skipUntil",
    "groupBy", "sort", "sortBy", "map",
    "delete", "clear",
    "push", "pop", "unshift",
    "update", "updateIn",
    "merge", "mergeWith", "deepMerge", "deepMergeWith",
    "setLength", "iterator",
]

var methods = ARRAY_METHODS.map(function (name) {
    return [name, function () {
        var res = this._vector[name].apply(this._vector, arguments)

        if (res && Array.isArray(res)) {
            res = ObservArray(res)
        }

        return res
    }]
})

module.exports = ArrayMethods

function ArrayMethods(obs) {
    methods.forEach(function (tuple) {
        obs[tuple[0]] = tuple[1]
    })
    return obs
}
