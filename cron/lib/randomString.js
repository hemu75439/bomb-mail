module.exports = (length) => {
    if (length <= 0) return "";
    let result = "";
    const hexChars = "0123456789abcdef";
    for (let i = 0; i < length; i++) {
        result += hexChars[Math.floor(Math.random() * 16)];
    }
    return result;
}
