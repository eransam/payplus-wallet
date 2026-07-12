import { describe, expect, it } from "vitest";
import { validateAmount, validateOptionalAmount } from "./validation";

describe("validateAmount", () => {
  it("מחזיר שגיאה כשהשדה ריק", () => {
    expect(validateAmount("")).toBe("יש להזין סכום");
    expect(validateAmount("   ")).toBe("יש להזין סכום");
  });

  it("מחזיר שגיאה על פורמט לא תקין", () => {
    expect(validateAmount("abc")).toBe("סכום לא תקין (לדוגמה: 30.00)");
    expect(validateAmount("10.999")).toBe("סכום לא תקין (לדוגמה: 30.00)");
  });

  it("מחזיר שגיאה על סכום 0", () => {
    expect(validateAmount("0")).toBe("הסכום חייב להיות גדול מ-0");
  });

  it("מחזיר שגיאה על פורמט שלילי", () => {
    expect(validateAmount("-5")).toBe("סכום לא תקין (לדוגמה: 30.00)");
  });

  it("מחזיר null על סכום תקין", () => {
    expect(validateAmount("30")).toBeNull();
    expect(validateAmount("30.50")).toBeNull();
  });
});

describe("validateOptionalAmount", () => {
  it("מאפשר שדה ריק", () => {
    expect(validateOptionalAmount("")).toBeNull();
  });

  it("בודק סכום כשיש ערך", () => {
    expect(validateOptionalAmount("10")).toBeNull();
    expect(validateOptionalAmount("abc")).toBe("סכום לא תקין (לדוגמה: 30.00)");
  });
});
