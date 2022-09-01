import { PRODUCTS } from "./products.const";
describe("product pricing", () => {
  describe("GRANOLA_50", () => {
    const expectedPricing: Record<number, number> = {
      4: 1600,
      5: 1900,
      6: 2200,
      7: 2500,
      8: 3200,
      9: 3500,
      10: 3800,
      11: 4100,
      12: 4400,
      13: 4700,
      14: 5000,
      15: 5700,
      16: 6000,
      17: 6300,
      18: 6600,
      19: 6900,
      20: 7200,
      21: 7500,
      22: 8200,
      23: 8500,
      24: 8800,
    };

    for (const qty of Object.keys(expectedPricing)) {
      it(`should correctly compute pricing for ${qty} qty`, () => {
        expect(PRODUCTS["GRANOLA_50"].price(parseInt(qty))).toEqual(
          expectedPricing[parseInt(qty)]
        );
      });
    }
  });
});
