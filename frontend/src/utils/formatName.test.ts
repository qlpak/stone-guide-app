import { formatStoneName } from "./formatName";

describe("formatStoneName", () => {
  it("converts hyphens to spaces", () => {
    expect(formatStoneName("black-marble")).toBe("Black Marble");
  });

  it("capitalizes first letter of each word", () => {
    expect(formatStoneName("taj-mahal")).toBe("Taj Mahal");
  });

  it("handles single word without hyphens", () => {
    expect(formatStoneName("granite")).toBe("Granite");
  });

  it("handles multiple hyphens", () => {
    expect(formatStoneName("super-white-quartzite")).toBe(
      "Super White Quartzite"
    );
  });

  it("handles already capitalized words", () => {
    expect(formatStoneName("MARBLE")).toBe("MARBLE");
  });

  it("handles mixed case input", () => {
    expect(formatStoneName("black-Forest-granite")).toBe(
      "Black Forest Granite"
    );
  });

  it("handles empty string", () => {
    expect(formatStoneName("")).toBe("");
  });

  it("handles string with only hyphens", () => {
    expect(formatStoneName("---")).toBe("   ");
  });

  it("handles consecutive hyphens", () => {
    expect(formatStoneName("blue--marble")).toBe("Blue  Marble");
  });

  it("handles real stone names", () => {
    expect(formatStoneName("carrara-marble")).toBe("Carrara Marble");
    expect(formatStoneName("calacatta-gold")).toBe("Calacatta Gold");
    expect(formatStoneName("emperador-dark")).toBe("Emperador Dark");
  });
});
