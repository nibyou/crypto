import { getRandomInt } from "../src/lib/utils";

describe("Random generate random int", () => {
    test("Random int is between 0 and 100", () => {
        const randomInt = getRandomInt(0, 100);
        expect(randomInt).toBeGreaterThanOrEqual(0);
        expect(randomInt).toBeLessThanOrEqual(100);
    });
});