const sanitize = (value) => {
    if (typeof value === "object") {
        return JSON.stringify(value);
    } else return value;
}

const sanitizeVariableValue = (value, mode) => {
    if (mode === "list") {
        const newValue = [];
        for (const item of value) {
            newValue.push(sanitize(item));
        }
        return newValue;
    } else {
        return sanitize(value);
    }
}

module.exports = {
  sanitizeValue,
  sanitize,
}
