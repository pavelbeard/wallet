import { z } from "zod";

const SignInSchema = z.object({
  email: z.string().email().min(3, { message: "Provide your email" }),
  password: z.string().min(1, { message: "Provide your password" }),
});

const SignUpSchema = z
  .object({
    email: z
      .string()
      .email()
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
        code: "custom",
        message: "Your password should contain at least 1 uppercase char!",
      });
    }

    if (!containsLowercase(password)) {
      checkPassComplexity.addIssue({
        code: "custom",
        message: "Your password should contain at least 1 lowercase char!",
      });
    }

    if (!containsSpecs(password)) {
      checkPassComplexity.addIssue({
        code: "custom",
        message:
          "Your password should contain at least 1 of those special chars: `!@#$%^&*()_\\-+=\\[\\]{};':\"\\\\|,.<>\\/?~",
      });
    }
  });

export { SignInSchema, SignUpSchema };
