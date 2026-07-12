import { cleanup, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import CreateMerchantForm from "./CreateMerchantForm";
import { renderWithProviders } from "../test/test-utils";

const mutateAsync = vi.fn();
const useCreateMerchantMock = vi.fn();

vi.mock("../hooks/useMerchants", () => ({
  useCreateMerchant: () => useCreateMerchantMock(),
}));

describe("CreateMerchantForm", () => {
  afterEach(() => {
    cleanup();
  });

  beforeEach(() => {
    mutateAsync.mockReset();
    useCreateMerchantMock.mockReturnValue({
      mutateAsync,
      isPending: false,
    });
  });

  it("מציג שגיאה כששולחים טופס ריק", async () => {
    const user = userEvent.setup();
    renderWithProviders(<CreateMerchantForm />);

    await user.click(screen.getByRole("button", { name: "צור סוחר" }));

    expect(screen.getByText("שם הסוחר הוא שדה חובה")).toBeInTheDocument();
    expect(mutateAsync).not.toHaveBeenCalled();
  });

  it("שולח את שם הסוחר כשהטופס תקין", async () => {
    const user = userEvent.setup();
    mutateAsync.mockResolvedValue({ id: 1, name: "בית קפה" });
    renderWithProviders(<CreateMerchantForm />);

    await user.type(screen.getByRole("textbox"), "בית קפה");
    await user.click(screen.getByRole("button", { name: "צור סוחר" }));

    await waitFor(() => {
      expect(mutateAsync).toHaveBeenCalledWith("בית קפה");
    });
  });
});
