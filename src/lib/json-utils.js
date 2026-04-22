import {safeStringify} from './tw-safe-stringify.js';

const sanitize = (value) => {
    if (value && typeof value === 'object') {
        return safeStringify(value);
    }
    return value;
};

const sanitizeVariableValue = (value, mode) => {
    if (mode === 'list') {
        const newValue = [];
        for (const item of value) {
            newValue.push(sanitize(item));
        }
        return newValue;
    }
    return sanitize(value);
};

export {
    sanitizeVariableValue,
    sanitize
};
