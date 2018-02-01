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
        const isValid = /^-?\d+(?:\.\d+)?$/.test(value);

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
     * @param {String} value
     * @param {String} [field] - name of the parameter containing value
     */
    text: (value, field = 'Text') => {
        const isValid = /^[\w\s-]+$/i.test(value);

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
