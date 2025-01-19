import Link from "next/link";

export const PublicUnauthorizedView = () => {
  return (
    <main className="flex flex-col items-center justify-center h-screen gap-8">
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
    </main>
  );
};
