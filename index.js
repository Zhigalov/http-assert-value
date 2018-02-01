const httpAssert = require('http-assert');
const Ajv = require('ajv');

const assert = (value, message, code, shortMessage, options = {}) => {
    if (shortMessage) {
        options.internalCode = `${code}_${shortMessage}`;
    }

    httpAssert(value, code, message, { options });
};

const methods = {
    identity: (value, field = 'Identity') => {
        const isValid = /^[\w\.-]+$/.test(value);

        assert(isValid, `${field} is invalid`, 400, 'III', { value });
    },

    float: (value, field = 'Float') => {
        const isValid = /^-?\d+(?:\.\d+)?$/.test(value);

        assert(isValid, `${field} is invalid`, 400, 'FVI', { value });
    },

    positiveInt: (value, field = 'Positive integer') => {
        const isValid = /^\d+$/.test(value) && Number(value) > 0;

        assert(isValid, `${field} is invalid`, 400, 'PII', { value });
    },

    text: (value, field = 'Text') => {
        const isValid = /^[\w\s-]+$/i.test(value);

        assert(isValid, `${field} is invalid`, 400, 'TVI', { value });
    },

    bySchema: (value, schema, options = {}) => {
        const ajv = new Ajv(options);
        const isValid = ajv.validate(schema, value);

        assert(isValid, 'Check by schema failed', 400, 'CSF', { errors: ajv.errors });
    }
};

const getTryName = key => {
    const firstLetter = key[0].toUpperCase();

    return `try${firstLetter}${key.slice(1)}`;
};

Object
    .keys(methods)
    .forEach(key => methods[getTryName(key)] = (value, ...args) => {
        if (value !== undefined) {
            methods[key](value, ...args);
        }
    });

module.exports = Object.assign(assert, methods);
