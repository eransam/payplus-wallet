import { z } from "zod";

export const createMerchantSchema = z.object({
  name: z.string().trim().min(1, "שם הסוחר הוא שדה חובה"),
});

export type CreateMerchantFormValues = z.infer<typeof createMerchantSchema>;
