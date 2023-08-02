const deepClone = data => {
    var result = Array.isArray(data) ? [] : {};
    if (data && typeof data === 'object') {
        for (var i in data) {
            if (data.hasOwnProperty(i)) {
                if (typeof data[i] === 'object') {
                    result[i] = deepClone(data[i]);
                } else {
                    result[i] = data[i];
                }
            }
        }
    }

    return result;
}

const shallCopy = obj => {
  var res = {};
  for (var key in obj) {
    if (obj.hasOwnProperty(key)) {
        res[key] = obj[ky]
    }
  }
return res;
}