"use client";
import { signin } from "@/actions/auth";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { SigninFormState } from "@/lib/definitions/auth.definitions";
import Link from "next/link";
import { useEffect, useState } from "react";

export const SigninForm = () => {
  const [rememberMe, setRememberMe] = useState(false);
  const [errors, setErrors] = useState<SigninFormState["errors"]>({});
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const memberData = localStorage.getItem("member-data");
    if (memberData) {
      setRememberMe(true);
      const { email, password } = JSON.parse(memberData);
      const emailInput = document.getElementById("email") as HTMLInputElement;
      const passwordInput = document.getElementById(
        "password"
      ) as HTMLInputElement;
      if (emailInput) {
        emailInput.value = email;
      }
      if (passwordInput) {
        passwordInput.value = password;
      }
    }
  }, []);

  const handleRememberMe = () => {
    console.log(rememberMe);
    if (!rememberMe) {
      const email = document.getElementById("email") as HTMLInputElement;
      const password = document.getElementById("password") as HTMLInputElement;
      localStorage.setItem(
        "member-data",
        JSON.stringify({
          email: email.value,
          password: password.value,
        })
      );
      setRememberMe(true);
    } else {
      localStorage.removeItem("member-data");
      setRememberMe(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setPending(true);
    const formData = new FormData(e.currentTarget);
    if (rememberMe) {
      localStorage.setItem(
        "member-data",
        JSON.stringify({
          email: formData.get("email"),
          password: formData.get("password"),
        })
      );
    }
    const request = await signin(formData);

    if (request?.errors) {
      setErrors(request.errors);
    } else if (request?.message) {
      setMessage(request.message);
    }
    setPending(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-2 w-full">
      <div>
        <label htmlFor="email">Email</label>
        <Input id="email" name="email" type="email" placeholder="Email" />
      </div>
      {errors?.email && <p>{errors.email}</p>}
      <div>
        <label htmlFor="password">Password</label>
        <Input id="password" name="password" type="password" />
      </div>
      <Link
        className="text-xs text-gray-500 hover:text-gray-700 transition-all duration-300 flex justify-end"
        href="/forgot-password"
      >
        Mot de passe oublié
      </Link>
      {errors?.password && (
        <div>
          <p>Password must:</p>
          <ul>
            {errors.password.map((error) => (
              <li key={error}>- {error}</li>
            ))}
          </ul>
        </div>
      )}
      <div className="flex items-center justify-center space-x-2">
        <Checkbox
          id="terms"
          onCheckedChange={handleRememberMe}
          checked={rememberMe}
        />
        <label
          htmlFor="terms"
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          Se souvenir de mes identifiants
        </label>
      </div>
      <Button type="submit" disabled={pending} className="w-full">
        Sign In
      </Button>
      {message && <p>{message}</p>}
    </form>
  );
};
