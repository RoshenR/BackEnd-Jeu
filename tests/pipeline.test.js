import { expect } from 'chai';

describe('pipeline sanity check', () => {
    it('runs a basic assertion', () => {
        expect(2 + 2).to.equal(4);
    });
});