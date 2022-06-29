import { PRODUCTS } from "./products.const";
describe("product pricing", () => {
  describe("GRANOLA_50", () => {
    const expectedPricing: Record<number, number> = {
      3: 1000,
      4: 1300,
      5: 1500,
      6: 2000,
      7: 2000,
      8: 2500,
      9: 2800,
      10: 3000,
      11: 3300,
      12: 3500,
      13: 4000,
      14: 4000,
      15: 4500,
      16: 4800,
      17: 5000,
      18: 5300,
      19: 5500,
      20: 6000,
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
