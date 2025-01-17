import { getSession } from "@/lib/session";

export default async function Home() {
  const { user } = await getSession();
  return <main>{user?.email} hello</main>;
}
