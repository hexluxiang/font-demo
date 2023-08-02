// A-1
const sliceStr = (s, k) => {
    const stack = [];
    let result = [];
    for (var i = 0; i < s.length; i++) {
        if (s[i] === '_' && stack[0] !== '"') {
            result.push(stack.join(''));
            stack.length = 0;
        } else if (s[i] === '"' && stack.length !== 0) {
            result.push(stack.join('') + '"');
            stack.length = 0;
        } else {
            stack.push(s[i])
        }
    }

    if (stack.length) result.push(stack.join(''));
    result = result.filter(ele => ele !== '');
    if (k > result.length - 1) return 'ERROR';
    result[k] = '******';
    return result.join('_')
}


// console.log(
//     sliceStr('aaaa__passsss_""_"aaaa__ffff_fff"_100euedjejej____', 3)
// );

// B-67
const findSmallNums = arr => {
    arr.sort((a, b) => a - b);
    const res = arr.slice(0, 3);
    return parseInt(res.join(''));
}
// console.log(findSmallNums([122, 111, 2, 3, 1, 0, -1]));

// C-116
const sortLetter = (str, idx) => {
    var arr = str.split('');
    arr.sort((a, b) => {
        var s1 = a.charCodeAt();
        var s2 = b.charCodeAt();
        return s1 - s2;
    });
    return str.indexOf(arr[idx - 1]);
}
// console.log(sortLetter('AkAsjdhduwSHSHJDJHAsjdhd', 4));

// D-7
const sortNum = str => {
    const arr = str.split(',').map((item, index) => [item, index]).sort((a, b) => b[0] - a[0]);
    const n = arr.length;
    const ids = new Array(n);
    for (var i = 0; i < n; i++) {
        ids[arr[i][1]] = i;
    }
    return ids.join(',');
}
// console.log(sortNum('9,3,5'));

// B-77  奖牌排行
const getCountryList = (nums, ...args) => {
    var arrs = args.map(item => {
        var l = item.split(' ');
        var obj = {
            name: l[0],
            gi: l[1] - 0,
            si: l[2] - 0,
            bi: l[3] - 0,
            total: parseInt(l[1]) + parseInt(l[2]) + parseInt(l[3])
        }
        return obj;
    }).sort((a, b) => {
        return b.gi !== a.gi
            ? b.gi - a.gi
            : b.si !== a.si
                ? b.si - a.si
                : b.bi !== a.bi
                    ? b.bi - a.bi
                    : a.name === b.name
                        ? 0
                        : a.name > b.name
                            ? 1
                            : -1;

    }).forEach(item => {
        console.log(item.name)
    })
}

console.log(getCountryList(4, 'kor 1 4 1', 'china 10 20 30', 'jp 1 2 3', 'us 100 1 1'));