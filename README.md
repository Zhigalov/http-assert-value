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
* schema `Object` - asserting value
* \[options\] `Object` - ajv constructor options

### assert.tryIdentity(value, field = 'Identity')
Assert slug or unique identity value, when value is defined

* value `String|Array<String>` - asserting value
* \[field\] `String` - name of the parameter containing value

### assert.tryFloat(value, field = 'Float')
Assert float value, when value is defined

* value `String|Array<String>` - asserting value
* \[field\] `String` - name of the parameter containing value

### assert.tryPositiveInt(value, field = 'Positive integer')
Assert positive integer value, when value is defined

* value `String|Array<String>` - asserting value
* \[field\] `String` - name of the parameter containing value

### assert.tryText(value, field = 'Text')
Assert text, like search request, when value is defined

* value `String|Array<String>` - asserting value
* \[field\] `String` - name of the parameter containing value

### assert.tryBySchema(value, schema, options = {})
Assert object by schema, when value is defined

* value `Any|Array<Any>` - asserting value
* schema `Object` - asserting value
* \[options\] `Object` - ajv constructor options
