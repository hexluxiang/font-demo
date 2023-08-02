Function.prototype._apply = function (context, args) {
    context = context || window;
    args = args ? args : [];
    context.fn = this;
    const res = context.fn(...args);
    delete context.fn;
    return res;
}

Function.prototype._call = function(context, ...args) {
    context = context || window;
    args = args ? args : [];
    context.fn = this;
    const res = context.fn(...args);
    delete context.fn;
    return res;
}

Function.prototype._bind = function(context, ...args) {
    context = context || window;
    let fn = this;
    return function newFun(...newArgs) {
        let res;
        if (this instanceof newFun) {
            res = new fn(...args, ...newArgs)
        } else {
            res = fn.call(context, ...args, ...newArgs)
        }
        return res;
    }
}