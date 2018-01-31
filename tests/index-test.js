const catchError = require('catch-error-async');
const assert = require('assert');

const sut = require('..');

describe('Assert', () => {
    describe('identity', () => {
        it('should do nothing when identity is valid', () => {
            sut.identity('valid');
            sut.identity('123', 'Field name');
            sut.identity('with-dash');
            sut.identity('with_underscore');
            sut.identity('UPPERCASE');
            sut.identity('with.dot');
        });

        it('should throw error with custom field', async () => {
            const error = await catchError(sut.identity, 'inv@l!d', 'Custom field name');

            assert.strictEqual(error.message, 'Custom field name is invalid');
            assert.strictEqual(error.statusCode, 400);
            assert.deepStrictEqual(error.options, {
                internalCode: '400_III',
                value: 'inv@l!d'
            });
        });

        it('should throw error with default field', async () => {
            const error = await catchError(sut.identity, 'inv@l!d');

            assert.strictEqual(error.message, 'Identity is invalid');
            assert.strictEqual(error.statusCode, 400);
            assert.deepStrictEqual(error.options, {
                internalCode: '400_III',
                value: 'inv@l!d'
            });
        });

        it('should throw error when value is empty', async () => {
            const error = await catchError(sut.identity, '');

            assert.strictEqual(error.message, 'Identity is invalid');
            assert.strictEqual(error.statusCode, 400);
            assert.deepStrictEqual(error.options, {
                internalCode: '400_III',
                value: ''
            });
        });
    });
});
