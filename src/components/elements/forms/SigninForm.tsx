"use client";
import { signin } from "@/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useActionState } from "react";

export const SigninForm = () => {
  const [state, action, pending] = useActionState(signin, undefined);

  return (
    <form action={action} className="space-y-2">
      <div>
        <label htmlFor="email">Email</label>
        <Input id="email" name="email" type="email" placeholder="Email" />
      </div>
      {state?.errors?.email && <p>{state.errors.email}</p>}
      <div>
        <label htmlFor="password">Password</label>
        <Input id="password" name="password" type="password" />
      </div>
      {state?.errors?.password && (
        <div>
          <p>Password must:</p>
          <ul>
            {state.errors.password.map((error) => (
              <li key={error}>- {error}</li>
            ))}
          </ul>
        </div>
      )}{" "}
      <Button type="submit" disabled={pending} className="w-full">
        Sign In
      </Button>
    </form>
  );
};
