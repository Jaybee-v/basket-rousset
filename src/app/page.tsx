import { TrainingForm } from "@/components/elements/forms/TrainingForm";
import { PublicUnauthorizedView } from "@/components/elements/public/PublicUnauthorizedView";
import { WeeklyTrainingsView } from "@/components/elements/training/WeeklyTrainingsView";
import { getSession } from "@/lib/session";
import { UserRole } from "@/types/UserRole";

export default async function Home() {
  const { user } = await getSession();
  if (!user) return <PublicUnauthorizedView />;

  if (user.role === UserRole.COACH)
    return (
      <main>
        <div>
          <section className="space-y-4 p-2">
            <h2 className="text-xl font-bold">Ajouter un entrainement</h2>
            <TrainingForm />
          </section>
          <section className="space-y-2 p-2">
            <h2 className="text-xl font-bold">Les séances de la</h2>

            <WeeklyTrainingsView user={user} />
          </section>
        </div>
      </main>
    );

  if (user.role === UserRole.USER)
    return (
      <main>
        <section className="space-y-4 p-2">
          <WeeklyTrainingsView user={user} />
        </section>
      </main>
    );
}
