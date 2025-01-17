"use server";
import {
  SigninFormSchema,
  SigninFormState,
  SignupFormSchema,
} from "@/lib/definitions";
import { compare, hash } from "@/lib/hashing";
import { prisma } from "@/lib/prisma";
import { createSession } from "@/lib/session";

export type UserRole = "COACH" | "USER";

export async function signup(formData: FormData) {
  const validatedFields = SignupFormSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
    role: formData.get("role"),
  });

  if (!validatedFields.success) {
    return { errors: validatedFields.error.flatten().fieldErrors };
  }

  const { name, email, password, role } = validatedFields.data;

  const existingUser = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (existingUser) {
    return {
      message: "Un compte avec cet email existe déjà",
    };
  }

  const hashedPassword = await hash(password, 10);

  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      role: role as UserRole,
    },
  });

  if (!user) {
    return {
      message: "Une erreur est survenue lors de la création de votre compte",
    };
  }

  await createSession(user.id, role as UserRole);
}

export async function signin(state: SigninFormState, formData: FormData) {
  const validatedFields = SigninFormSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!validatedFields.success) {
    return { errors: validatedFields.error.flatten().fieldErrors };
  }

  const { email, password } = validatedFields.data;

  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (!user) {
    return {
      message: "Identifiants incorrects",
    };
  }

  const isPasswordValid = await compare(password, user.password);

  if (!isPasswordValid) {
    return {
      message: "Identifiants incorrects",
    };
  }

  await createSession(user.id);
}
