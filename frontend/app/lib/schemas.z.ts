import { RefinementCtx, z } from "zod";

const passwordComplexityChecker = (
  { password }: { password: string },
  checkPassComplexity: RefinementCtx,
) => {
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
};

const enum SignUpSchemaSuperRefineErrors {
  notUppercase = "notUppercase",
  notLowercase = "notLowercase",
  notSpecs = "notSpecs",
}

const SignInSchema = z.object({
  email: z.string().email({ message: "Provide your email!" }),
  password: z.string().min(1, { message: "Provide your password" }),
});
const SignUpSchema = z
  .object({
    username: z
      .string()
      .min(4, { message: "Provide your username" })
      .regex(new RegExp("^[a-zA-Z0-9_]+$"), {
        message:
          "Your username should contain only letters, numbers and underscores",
      })
      .max(20, { message: "Your username is too long" }),
    first_name: z.string().min(1, { message: "Provide your first name" }),
    last_name: z.string().min(1, { message: "Provide your last name" }),
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
  .superRefine(passwordComplexityChecker);

const ChangeEmailSchema = z.object({
  email: z.string().email({ message: "Provide your email!" }),
});

const TwoFactorSchema = z.object({
  token: z.string().min(6, { message: "Provide your token" }),
});

const AuthDataSchema = z.object({
  access_token: z.string().min(1, { message: "Provide your token" }),
  access_token_exp: z.number().min(1, { message: "Provide token expiration" }),
  refresh_token: z.string().min(1, { message: "Provide your token" }),
  expires_at: z.number().min(1, { message: "Provide token expiration" }),
  user: z.object({
    public_id: z.string().min(1, { message: "Public id is required" }),
    username: z.string().min(1, { message: "Username is required" }),
    email: z.string().min(1, { message: "Email is required" }),
    orig_iat: z.number().min(1, { message: "Orig iat is required" }),
    otp_device_id: z.string().optional().nullable(),
    created_at: z.string().optional().nullable(),
    provider: z.string().optional(),
    verified: z.boolean().optional(),
    is_two_factor_enabled: z.boolean(),
    is_email_verified: z.boolean(),
    is_oauth_user: z.boolean(),
  }),
});

const PasswordSchema = z.object({
  password: z.string().min(1, { message: "Provide your password" }),
});

const ChangePasswordSchema = z
  .object({
    actualPassword: z.string().min(8, { message: "Provide your password" }),
    password: z.string().min(8, { message: "Provide your password" }),
    password2: z.string().min(8, { message: "Provide your password" }),
  })
  .refine(
    ({ password: newPassword, password2: confirmPassword }) => {
      return newPassword == confirmPassword;
    },
    {
      message: "Passwords aren't match.",
      path: ["confirmPassword"],
    },
  )
  .superRefine(passwordComplexityChecker);

const NextAuthUserSchema = AuthDataSchema;
const SessionSchema = AuthDataSchema;

export type SignInValidator = z.infer<typeof SignInSchema>;
export type SignUpValidator = z.infer<typeof SignUpSchema>;
export type ChangeEmailValidator = z.infer<typeof ChangeEmailSchema>;
export type TwoFactorValidator = z.infer<typeof TwoFactorSchema>;
export type UpdateSessionValidator = z.infer<typeof AuthDataSchema>;
export type PasswordValidator = z.infer<typeof PasswordSchema>;
export type ChangePasswordValidator = z.infer<typeof ChangePasswordSchema>;
export type NextAuthUserValidator = z.infer<typeof NextAuthUserSchema>;
export type SessionValidator = z.infer<typeof SessionSchema>;

export {
  ChangeEmailSchema,
  ChangePasswordSchema,
  NextAuthUserSchema,
  PasswordSchema,
  SessionSchema,
  SignInSchema,
  SignUpSchema,
  SignUpSchemaSuperRefineErrors,
  TwoFactorSchema,
  AuthDataSchema as UpdateSessionSchema,
};
