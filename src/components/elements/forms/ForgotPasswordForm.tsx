"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export const ForgotPasswordForm = () => {
  return (
    <form className="space-y-2 w-full">
      <div>
        <label>Je renseigne mon adresse email</label>
        <Input type="email" placeholder="Email" />
      </div>
      <section className="flex justify-end">
        <Button className="" type="submit">
          Réinitialiser mon mot de passe
        </Button>
      </section>
    </form>
  );
};
