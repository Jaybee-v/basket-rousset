import { ForgotPasswordForm } from "@/components/elements/forms/ForgotPasswordForm";
import Link from "next/link";

export default function ForgotPasswordPage() {
  return (
    <main className="p-2 space-y-6 flex flex-col items-center justify-center h-screen w-full md:max-w-md md:mx-auto">
      <h1 className="text-2xl font-bold">Mot de passe oublié</h1>
      <ForgotPasswordForm />
      <section className="flex flex-col justify-center items-center gap-4 w-full">
        <Link
          href="/login"
          className="text-gray-500 hover:text-gray-700 transition-all duration-300"
        >
          Je me connecte
        </Link>
        <Link
          href="/signup"
          className="text-gray-500 hover:text-gray-700 transition-all duration-300"
        >
          Je crée mon compte
        </Link>
      </section>
    </main>
  );
}
