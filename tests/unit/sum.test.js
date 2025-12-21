import { strict as assert } from "node:assert";
import { sum } from "../../src/utils/sum.js";

describe("sum()", () => {
    it("adds two numbers", () => {
        assert.equal(sum(2, 3), 5);
    });
});
