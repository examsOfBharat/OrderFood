import { z } from "zod";

export const storeProfileSchema = z.object({
  name: z.string().min(2, "Store name must be at least 2 characters"),
  description: z.string().optional(),
  phone: z.string().min(10, "Valid phone number required"),
  address: z.string().min(5, "Address is required"),
  openTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Invalid time format"),
  closeTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Invalid time format"),
  isOpen: z.boolean().default(false),
  deliveryRadiusKm: z.coerce.number().min(0),
  deliveryFee: z.coerce.number().min(0),
  minimumOrder: z.coerce.number().min(0),
  isPickupEnabled: z.boolean().default(true),
});
