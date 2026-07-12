import { z } from "zod";

export const editMerchantSchema = z.object({
  name: z.string().trim().min(1, "שם הסוחר הוא שדה חובה"),
  status: z.enum(["active", "inactive"]),
});

export type EditMerchantFormValues = z.infer<typeof editMerchantSchema>;

export const editWalletSchema = z.object({
  owner_identity: z.string().trim().min(1, "מזהה הבעלים הוא שדה חובה"),
  status: z.enum(["active", "inactive"]),
});

export type EditWalletFormValues = z.infer<typeof editWalletSchema>;
