const httpAssert = require('http-assert');
const Ajv = require('ajv');

/**
 * Assert value with http-specific error data
 *
 * @param {String} value
 * @param {String} message - error text
 * @param {Number} code - error http-code
 * @param {String} shortMessage - error three-letters code
 * @param {Object} [options] - error additional information
 */
const assert = (value, message, code, shortMessage, options = {}) => {
    if (shortMessage) {
        options.internalCode = `${code}_${shortMessage}`;
    }

    httpAssert(value, code, message, { options });
};

const methods = {
    /**
     * Assert slug or unique identity value
     *
     * @param {String} value
     * @param {String} [field] - name of the parameter containing value
     */
    identity: (value, field = 'Identity') => {
        const isValid = /^[\w\.-]+$/.test(value);

        assert(isValid, `${field} is invalid`, 400, 'III', { value });
    },

    /**
     * Assert float value
     *
     * @param {String} value
     * @param {String} [field] - name of the parameter containing value
     */
    float: (value, field = 'Float') => {
        const isValid = /^-?\d+(?:\.(?:\d+)?)?$/.test(value);

        assert(isValid, `${field} is invalid`, 400, 'FVI', { value });
    },

    /**
     * Assert positive integer value
     *
     * @param {String} value
     * @param {String} [field] - name of the parameter containing value
     */
    positiveInt: (value, field = 'Positive integer') => {
        const isValid = /^\d+$/.test(value) && Number(value) > 0;

        assert(isValid, `${field} is invalid`, 400, 'PII', { value });
    },

    /**
     * Assert text, like search request
     *
     * If value equals undefined, format value to string
     * @see https://stackoverflow.com/a/1085199
     *
     * @param {String} value
     * @param {String} [field] - name of the parameter containing value
     */
    text: (value = '', field = 'Text') => {
        const isValid = /^[^*;!#$%:^&)(?></\\]+$/i.test(value);

        assert(isValid, `${field} is invalid`, 400, 'TVI', { value });
    },

    /**
     * Assert object by schema
     *
     * @param {Object} value
     * @param {Object} schema
     * @param {Object} [options] - ajv constructor options
     */
    bySchema: (value, schema, options = {}) => {
        const ajv = new Ajv(options);
        const isValid = ajv.validate(schema, value);

        assert(isValid, 'Check by schema failed', 400, 'CSF', { errors: ajv.errors });
    },

    /**
     * Assert value, that it is in array
     *
     * @param {*} value
     * @param {Array} expected
     * @param {Function} comparator, which compare values
     */
    oneOf(value, expected = [], comparator = (lhs, rhs) => lhs === rhs) {
        const isValid = expected.some(expValue => comparator(expValue, value));

        assert(isValid, 'Value is not allowed', 400, 'VNA', { value, expected });
    },

    /**
     * Assert that value is right id (positive number)
     *
     * @param {Number} value
     * @param {String} [field] - name of the parameter containing value
     */
    id(value, field = 'Id') {
        const isValid = /^\d+$/.test(value) && Number(value) > 0;

        assert(isValid, `${field} is invalid`, 400, 'III', { value });
    },

    /**
     * Assert that value length is less than passed maxLength
     *
     * @param {String} value
     * @param {Number} [maxLength] - max length of a string
     * @param {String} [field] - name of the parameter containing value
     */
    maxLength(value, maxLength = 0, field = 'Text') {
        const isValid = value && value.length < maxLength;
        const assertMessage = `${field} should be less than ${maxLength} characters`;

        assert(isValid, assertMessage, 400, 'TML', { value, maxLength });
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

Object
    .keys(methods)
    .forEach(key => assert[key] = (value, ...args) => {
        const method = methods[key];

        if (Array.isArray(value)) {
            value.forEach(item => method(item, ...args));
        } else {
            method(value, ...args)
        }
    });

module.exports = assert;
