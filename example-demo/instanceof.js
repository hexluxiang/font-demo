const _instanceof = (left, right) => {
    var val = typeof left;
    if (val === 'number' || val === 'string' || val === 'boolean') {
        return false;
    }
    let rp = right.prototype;
    left = left.__proto__;

    while(true) {
        if (left == null) {
            return false
        }

        if (left === rp) {
            return true
        }
        left = left.__proto__;
    }
}

console.log(_instanceof(2, Number));