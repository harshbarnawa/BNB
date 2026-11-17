const test = require('node:test');
const assert = require('node:assert/strict');
const { parseLeadPayload, statuses } = require('../utils/leadValidation');

const valid = {
    name: 'Harsh Example',
    email: 'example@example.com',
    serviceId: 'business',
    requirements: 'A clear company website with a contact page.',
    consent: true
};

test('accepts and normalizes a valid enquiry', () => {
    const result = parseLeadPayload({ ...valid, email: '  HELLO@EXAMPLE.COM ' });
    assert.equal(result.error, undefined);
    assert.equal(result.value.email, 'hello@example.com');
    assert.equal(result.value.status, undefined);
    assert.ok(result.value.consentAt instanceof Date);
});

test('rejects missing consent or short requirements', () => {
    assert.ok(parseLeadPayload({ ...valid, consent: false }).error);
    assert.ok(parseLeadPayload({ ...valid, requirements: 'too short' }).error);
});

test('rejects invalid email, service and contact information', () => {
    assert.ok(parseLeadPayload({ ...valid, email: 'not-an-email' }).error);
    assert.ok(parseLeadPayload({ ...valid, serviceId: 'payments' }).error);
    assert.ok(parseLeadPayload({ ...valid, phone: 'abc-def' }).error);
});

test('rejects oversize fields and non-object payloads', () => {
    assert.ok(parseLeadPayload({ ...valid, name: 'a'.repeat(101) }).error);
    assert.ok(parseLeadPayload({ ...valid, requirements: 'a'.repeat(3001) }).error);
    assert.ok(parseLeadPayload(null).error);
    assert.ok(parseLeadPayload([]).error);
});

test('defines the six supported lead statuses', () => {
    assert.deepEqual([...statuses], ['new', 'contacted', 'discussion', 'quotation_sent', 'won', 'lost']);
});
