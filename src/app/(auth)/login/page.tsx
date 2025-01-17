import { SigninForm } from "@/components/elements/forms/SigninForm";
import { getSession } from "@/lib/session";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function LoginPage() {
  const { isAuth } = await getSession();

  if (isAuth) redirect("/");

  return (
    <div className="p-2 space-y-6 flex flex-col items-center justify-center h-screen w-full md:max-w-md md:mx-auto">
      <h1 className="text-2xl font-bold">Connexion</h1>
      <SigninForm />
      <Link
        href="/signup"
        className="text-sm text-gray-500 hover:text-gray-700 transition-all duration-300"
      >
        Je crée mon compte
      </Link>
    </div>
  );
}
