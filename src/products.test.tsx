import { PRODUCTS } from "./products.const";
describe("product pricing", () => {
  describe("GRANOLA_50", () => {
    const expectedPricing: Record<number, number> = {
      3: 1200,
      4: 1500,
      5: 1800,
      6: 2400,
      7: 2400,
      8: 3000,
      9: 3300,
      10: 3600,
      11: 3900,
      12: 4200,
      13: 4800,
      14: 4800,
      15: 5400,
      16: 5700,
      17: 6000,
      18: 6300,
      19: 6600,
      20: 7200,
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
