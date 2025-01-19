import { z } from "zod";

export const TrainingFormSchema = z.object({
  date: z.coerce
    .date({
      required_error: "Vous devez sélectionner une date",
      invalid_type_error: "Format de date invalide",
    })
    .min(new Date(), {
      message: "Vous ne pouvez pas planifier une séance dans le passé",
    }),
  description: z.string().optional(),
});

export type TrainingFormState = {
  errors: {
    date?: string[];
    description?: string[];
  };
  message?: string;
};
