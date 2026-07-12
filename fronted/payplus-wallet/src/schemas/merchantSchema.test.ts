import { describe, expect, it } from "vitest";
import { createMerchantSchema } from "./merchantSchema";

describe("createMerchantSchema", () => {
  it("מאשר שם תקין", () => {
    const result = createMerchantSchema.safeParse({ name: "בית קפה" });
    expect(result.success).toBe(true);
  });

  it("דוחה שם ריק", () => {
    const result = createMerchantSchema.safeParse({ name: "   " });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0]?.message).toBe("שם הסוחר הוא שדה חובה");
    }
  });
});
