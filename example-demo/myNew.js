const _new = function () {
    // 1.创建一个空对象
    let obj = {}
    // 2.取出参数中的第一个参数，获得构造函数
    let constructor = [].shift.call(arguments)
    // 3.连接原型
    obj.__proto__ = constructor.prototype
    // 4.执行构造函数，即绑定 this，并且为这个新对象添加属性
    let res = constructor.apply(obj, arguments)
    // 5.返回新对象
    return typeof res === 'object' ? res : obj
}