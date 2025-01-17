import { SignupForm } from "@/components/elements/forms/SignupForm";
import { getSession } from "@/lib/session";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function SignupPage() {
  const { isAuth } = await getSession();

  if (isAuth) redirect("/");

  return (
    <div className="p-2 space-y-6 flex flex-col items-center justify-center h-screen w-full md:max-w-md md:mx-auto">
      <h1 className="text-2xl font-bold">Je m&apos;inscris</h1>

      <SignupForm />
      <Link
        href="/login"
        className="text-sm text-gray-500 hover:text-gray-700 transition-all duration-300"
      >
        J&apos;ai déjà un compte
      </Link>
    </div>
  );
}
