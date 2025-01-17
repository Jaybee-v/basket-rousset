"use client";
import { signup } from "@/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SignupFormState } from "@/lib/definitions";
import { useState } from "react";

export function SignupForm() {
  const [errors, setErrors] = useState<SignupFormState["errors"]>({});
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setPending(true);
    setErrors({});
    setMessage("");

    const formData = new FormData(event.currentTarget);
    const response = await signup(formData);
    console.log(response);
    if (response?.errors) {
      setErrors(response.errors);
    } else if (response?.message) {
      setMessage(response.message);
    }

    setPending(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <div>
        <label htmlFor="name">Name</label>
        <Input id="name" name="name" placeholder="Name" />
      </div>
      {errors?.name && <p>{errors.name}</p>}
      <div>
        <label htmlFor="email">Email</label>
        <Input id="email" name="email" type="email" placeholder="Email" />
      </div>
      {errors?.email && <p>{errors.email}</p>}
      <div>
        <label htmlFor="password">Password</label>
        <Input id="password" name="password" type="password" />
      </div>
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
      <div>
        <label htmlFor="role">Vous êtes</label>

        <Select name="role" defaultValue="USER">
          <SelectTrigger className="max-w-xl">
            <SelectValue placeholder="Sélectionnez votre rôle" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="COACH">Coach</SelectItem>
            <SelectItem value="USER">Joueur</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <Button type="submit" disabled={pending} className="w-full">
        Sign Up
      </Button>
      {message && <p>{message}</p>}
    </form>
  );
}
