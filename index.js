const httpAssert = require('http-assert');
const Ajv = require('ajv');

function assert(value, message, code, shortMessage, options = {}) {
    if (shortMessage) {
        options.internalCode = `${code}_${shortMessage}`;
    }

    httpAssert(value, code, message, { options });
}

assert.identity = (value, field = 'Identity') => {
    const isValid = /^[\w\.-]+$/.test(value);

    assert(isValid, `${field} is invalid`, 400, 'III', { value });
};

assert.float = (value, field = 'Float') => {
    const floatValue = parseFloat(value);
    const isValid = !isNaN(floatValue);

    assert(isValid, `${field} is invalid`, 400, 'FVI', { value });
};

assert.positiveInt = (value, field = 'Positive integer') => {
    const isValid = /^\d+$/.test(value) && Number(value) > 0;

    assert(isValid, `${field} is invalid`, 400, 'PII', { value });
};

assert.text = (value, field = 'Text') => {
    const isValid = /^[^*;!#$%:^&)(?></\\]+$/i.test(value);

    assert(isValid, `${field} is invalid`, 400, 'TII', { value });
};

assert.bySchema = (value, schema, options = {}) => {
    const ajv = new Ajv(options);
    const isValid = ajv.validate(schema, value);

    assert(isValid, 'Check by schema failed', 400, 'CSF', { errors: ajv.errors });
};

module.exports = assert;
