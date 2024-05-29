/**
* 比较两个数组是否相等，浅比较
* @param arrA
* @param arrB
* @returns
*/
export const compareArrIsEqual = (arrA: Array<string>, arrB: Array<string>) => {
    if (arrA.length !== arrB.length) {
        return false;
    }
    return arrA.every((value, index) => value === arrB[index]);
};