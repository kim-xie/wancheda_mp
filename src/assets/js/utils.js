export function isChinese(value) {
    const reg = new RegExp("[\\u4E00-\\u9FFF]+", "g")
    if (reg.test(value)) {
        return true
    }else{
        return false
    }
}