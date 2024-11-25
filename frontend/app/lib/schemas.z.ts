import { z } from "zod";

const SignInSchema = z.object({
  email: z.string().email({ message: "Provide your email!" }),
  password: z.string().min(1, { message: "Provide your password" }),
});

const enum SignUpSchemaSuperRefineErrors {
  notUppercase = "notUppercase",
  notLowercase = "notLowercase",
  notSpecs = "notSpecs",
}

const SignUpSchema = z
  .object({
    email: z
      .string()
      .email({ message: "Provide your email!" })
      .min(10, { message: "Provide your email! e.g: example@domain.com" }),
    password: z.string().min(8, { message: "Provide your password" }).max(20),
    password2: z.string(),
  })
  .refine((v) => v.password == v.password2, {
    message: "Password aren't match.",
    path: ["password2"],
  })
  .superRefine(({ password }, checkPassComplexity) => {
    const containsUppercase = (c: string) => /[A-Z]/.test(c);
    const containsLowercase = (c: string) => /[a-z]/.test(c);
    const containsSpecs = (c: string) =>
      /[`!@#$%^&*()_\-+=\[\]{};':"\\|,.<>\/?~]/.test(c);

    if (!containsUppercase(password)) {
      checkPassComplexity.addIssue({
        path: [SignUpSchemaSuperRefineErrors.notUppercase],
        code: "custom",
        message: "Your password should contain at least 1 uppercase char!",
      });
    }

    if (!containsLowercase(password)) {
      checkPassComplexity.addIssue({
        path: [SignUpSchemaSuperRefineErrors.notLowercase],
        code: "custom",
        message: "Your password should contain at least 1 lowercase char!",
      });
    }

    if (!containsSpecs(password)) {
      checkPassComplexity.addIssue({
        path: [SignUpSchemaSuperRefineErrors.notSpecs],
        code: "custom",
        message:
          "Your password should contain at least 1 of those special chars: `!@#$%^&*()_\\-+=\\[\\]{};':\"\\\\|,.<>\\/?~",
      });
    }
  });

const ChangeEmailSchema = z.object({
  email: z.string().email({ message: "Provide your email!" }),
});

const TwoFactorSchema = z.object({
  token: z.string().min(6, { message: "Provide your token" }),
});

export type SignInValidator = z.infer<typeof SignInSchema>;
export type SignUpValidator = z.infer<typeof SignUpSchema>;
export type ChangeEmailValidator = z.infer<typeof ChangeEmailSchema>;
export type TwoFactorValidator = z.infer<typeof TwoFactorSchema>;

export {
  ChangeEmailSchema,
  SignInSchema,
  SignUpSchema,
  SignUpSchemaSuperRefineErrors,
  TwoFactorSchema,
};
