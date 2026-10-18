import z from "zod";
export const loginSchema = z.object({
  email: z.email("Invalid email format"),
  password: z
    .string("password is required")
    .min(8, "password must be 8 characters long")
    .max(24, "password can't be more that 24 characters")
    .regex(/[a-z]/, "password should have one small letter")
    .regex(/[A-Z]/, "password should have one capital letter"),
});

export const registerSchema = z
  .object(
    {
      name: z.string().min(1, "Name is required"),
      email: z.email("Invalid email format"),
      password: z
        .string()
        .min(1, "password is required")
        .min(8, "password must be 8 characters long")
        .max(24, "password can't be more that 24 characters")
        .regex(/[a-z]/, "password should have one small letter")
        .regex(/[A-Z]/, "password should have one capital letter"),
      confirmPassword: z.string("password is required"),
      role: z.enum(["PROJECT_MANAGER", "TEAM_MEMBER"]).default("TEAM_MEMBER"),
      photo: z
        .file()
        .max(5000000, "File cannot exceed 5MB")
        .mime(["image/png", "image/jpeg", "image/webp"], {
          message: "Only PNG, JPEG, and WebP images are allowed",
        })
        .nullable(),
    },
    "Please provide a valid object",
  )
  .refine((val) => val.password === val.confirmPassword, {
    path: ["confirmPassword"],
    message: "Password and confirm password doesn't match",
  });

export const resendOtpSchema = z.object({
  email: z.email("Invalid email format"),
});

export const forgotPasswordSchema = z.object({
  email: z.email("Invalid email format"),
});

export const resetPasswordSchema = z
  .object({
    email: z.email("Invalid email format"),
    otp: z.string("OTP is required").length(6, "OTP must be 6 digits"),
    new_password: z
      .string("password is required")
      .min(8, "password must be 8 characters long")
      .max(24, "password can't be more that 24 characters")
      .regex(/[a-z]/, "password should have one small letter")
      .regex(/[A-Z]/, "password should have one capital letter"),
    confirmPassword: z.string("password is required"),
  })
  .refine((val) => val.new_password === val.confirmPassword, {
    path: ["confirmPassword"],
    message: "Password and confirm password doesn't match",
  });
