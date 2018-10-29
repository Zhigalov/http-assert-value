# http-assert of typed values

## Install
```bash
npm install http-assert-value --save
```

## Usage
```js
const assert = require('http-assert-value');

// Common assert interface
assert(+0 === -0, 'Zeros are not equal', 500, 'ZNE', {
    leftOperand: +0,
    reghtOperand: -0,
    operation: '==='
});                                        // Ok

// Assert typed values
assert.identity('green-mile');             // Ok
assert.float('3.14');                      // Ok
assert.positiveInt('12');                  // Ok
assert.text('The Green Mile');             // Ok

// Assert by JSON schema
// @see: http://json-schema.org/
assert.bySchema('1', { type: 'integer' }); // Ok

// All methods have duplicates with `try...`
assert.text(undefined);                    // Error
assert.tryText(undefined);                 // Ok

try {
    assert.text('DROP DATABASE BOOKS;');
} catch (error) {
    error.message;    // 'Text is invalid'
    error.statusCode; // 400
    error.options;    // { value: 'DROP DATABASE BOOKS;', internalCode: '400_TVI' }
}
```

## API

### assert(value, message, code, shortMessage, options={})
Assert value with http-specific error data

* value `Any` - asserting value
* message `String` - error text
* code `Number` - error http-code
* shortMessage `String` - three-letter error code
* \[options\] `Object` - error additional information

### assert.identity(value, field = 'Identity')
Assert slug or unique identity value

* value `String|Array<String>` - asserting value
* \[field\] `String` - name of the parameter containing value

### assert.float(value, field = 'Float')
Assert float value

* value `String|Array<String>` - asserting value
* \[field\] `String` - name of the parameter containing value

### assert.positiveInt(value, field = 'Positive integer')
Assert positive integer value

* value `String|Array<String>` - asserting value
* \[field\] `String` - name of the parameter containing value

### assert.text(value, field = 'Text')
Assert text, like search request

* value `String|Array<String>` - asserting value
* \[field\] `String` - name of the parameter containing value

### assert.bySchema(value, schema, options = {})
Assert object by schema

* value `Any|Array<Any>` - asserting value
* schema `Object` - json-schema
* \[options\] `Object` - ajv constructor options

### assert.oneOf(value, expected = [], comparator)
Assert value, that it is in array

* value `Any` - asserting value
* \[expected\] `Array` - array which contains expected values
* \[comparator\] `Function` - function which compare values from array with asserting
value. By default used comparator to compare primitive (`(lhs, rhs) => lhs === rhs`)

### assert.id(value, field = 'Id')
Alias for `assert.positiveInt`

### assert.maxLength(value, maxLength = 0, field = 'Text')
Assert that value length is less than passed maxLength

* value `Any` - asserting value
* \[maxLength\] `Number` - max allowed length of a string
* \[field\] `String` - name of the parameter containing value


Every method has *try-version* method, which has same interface and assert value,
when value is passed:

- assert.tryIdentity
- assert.tryFloat
- assert.tryPositiveInt
- assert.tryText
- assert.tryBySchema
- assert.oneOf
- assert.id
- assert.maxLength
