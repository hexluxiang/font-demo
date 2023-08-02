const PromiseAll = promiseList => {
    const promises = Array.from(promiseList); // 传入的iterable promise
    let index = 0;// 成功一个则++
    const data = []; // 成功的数据
    const len = promises.length; // 长度
    return new Promise((resolve, reject) => {
        for (let i in promises) {
            promises[i]
                .then((res) => {
                    data[i] = res;
                    if (++index === len) {
                        resolve(data);
                    }
                })
                .catch((err) => {
                    reject(err);
                });
        }
    })
}

const PromiseRace = promiseList => {
    return new Promise((resolve, reject) => {
        promiseList.forEach(p => {
            Promise.resolve(p).then(res => {
                resolve(res)
            }).catch(err => {
                reject(err)
            })
        });
    })
}

const p1 = Promise.resolve('succes');
const p2 = new Promise((resolve, reject) => {
    setTimeout(resolve, 5000, 'promise2')
})
const p3 = new Promise((resolve, reject) => {
    setTimeout(resolve, 1000, 'promise3')
})

const p4 = () => {
    return new Promise(res => {
        setTimeout(res, 1000, '成功啦')
    })
}

const p5 = () => {
    return new Promise((res, rej) => {
        setTimeout(rej, 900, '失败啦')
    })
}

// PromiseAll([p1, p2, p3]).then(res => {
//     console.log('all', res);
// }).catch((err) => {
//     console.log('err1:', err);
// });

PromiseRace([p4(), p5()]).then(res => {
    console.log('race', res);
}).catch((err) => {
    console.log('err2:', err);
});