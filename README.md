# http-assert of typed values

### Install
```bash
npm install http-assert-value --save
```

### Example
```js
const assert = require('http-assert-value');

assert.identity('green-mile');             // Ok
assert.float('3.14');                      // Ok
assert.positiveInt('12');                  // Ok
assert.text('The Green Mile');             // Ok
assert.bySchema('1', { type: 'integer' }); // Ok
assert.tryText(undefined);                 // Ok

try {
    assert.text('DROP DATABASE BOOKS;');
} catch (error) {
    error.message;    // 'Text is invalid'
    error.statusCode; // 400
    error.options;    // { value: 'DROP DATABASE BOOKS;', internalCode: '400_TVI' }
}
```
