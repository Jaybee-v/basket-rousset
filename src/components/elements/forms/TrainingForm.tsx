"use client";

import { createTraining } from "@/actions/training";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { TrainingFormState } from "@/lib/definitions/training.definitions";
import { useState } from "react";

export const TrainingForm = () => {
  const [errors, setErrors] = useState<TrainingFormState["errors"]>({});
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState("");
  const [httpStatus, setHttpStatus] = useState(0);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setPending(true);
    setErrors({});
    setMessage("");

    const formData = new FormData(event.currentTarget);

    const response = await createTraining(formData);
    console.log(response);
    if (response?.errors) {
      setErrors(response.errors);
      console.log(response.errors);
    } else if (response?.message) {
      setHttpStatus(response.status);
      setMessage(response.message);
    }
    setTimeout(() => {
      setPending(false);
      window.location.reload();
    }, 1200);
  };

  const getInputDate = () => {
    const input = document.getElementById("date") as HTMLInputElement;
    if (input) {
      const date = new Date(input.value);
      return `${new Date(date).toLocaleDateString("fr-FR", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      })} : ${new Date(date).toLocaleDateString("fr-FR", {
        hour: "2-digit",
        minute: "2-digit",
      })}`;
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-2 w-full">
      <div>
        <label htmlFor="date">
          Date <span className="text-red-600 font-bold">*</span>
        </label>
        <Input
          id="date"
          name="date"
          type="datetime-local"
          className={`${
            errors?.date ? "border-red-600 placeholder:text-red-600" : ""
          }`}
        />
      </div>
      {errors?.date && <p className="text-red-600">{errors.date}</p>}
      <div>
        <label htmlFor="description">Description</label>
        <Textarea
          id="description"
          name="description"
          rows={4}
          placeholder="Ajouter un message pour les utilisateurs (facultatif)"
        />
      </div>
      {errors?.description && (
        <p className="text-red-600">{errors.description}</p>
      )}
      <section className="relative">
        <section className="flex justify-end">
          <Button type="submit" disabled={pending}>
            {pending ? "En cours..." : "Enregistrer"}
          </Button>
        </section>

        {message && (
          <Alert
            variant={httpStatus === 201 ? "success" : "destructive"}
            className="bg-green-50 z-50 absolute top-0 right-0"
          >
            <AlertTitle>
              {httpStatus === 201 ? (
                <span>{getInputDate()}</span>
              ) : (
                "destructive"
              )}
            </AlertTitle>
            <AlertDescription>{message}</AlertDescription>
          </Alert>
        )}
      </section>
    </form>
  );
};
