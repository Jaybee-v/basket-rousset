import { findUserTraining } from "@/actions/user";
import { PublicUnauthorizedView } from "@/components/elements/public/PublicUnauthorizedView";
import { TrainingCard } from "@/components/elements/training/TrainingCard";
import { getSession } from "@/lib/session";
import { Ban, UserIcon } from "lucide-react";

const ARTICLE = (props: {
  data: number;
  icon: React.ReactNode;
  label: string;
}) => {
  return (
    <section className="flex flex-col items-center gap-2 p-4 bg-card rounded-md font-black tracking-widest">
      {props.icon}
      <p>{props.data}</p>
      <p className="text-sm text-muted-foreground text-center">{props.label}</p>
    </section>
  );
};

export default async function ProfilePage() {
  const { user, isAuth } = await getSession();

  if (!user) return <PublicUnauthorizedView />;

  if (!isAuth) return <PublicUnauthorizedView />;

  const userTraining = await findUserTraining(user.id);

  return (
    <div className="space-y-4 ">
      <h1 className="text-2xl font-bold">Mon compte</h1>
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4 p-2">
        <ARTICLE
          data={userTraining && userTraining.completedTrainings!.length!}
          icon={<UserIcon />}
          label="Enrainements effectués"
        />
        <ARTICLE
          data={userTraining && userTraining.totalAbsents!}
          icon={<Ban />}
          label="Enrainements absents"
        />
      </section>
      <section>
        {userTraining &&
          userTraining.user &&
          userTraining.user.trainings.map((training) => (
            <TrainingCard key={training.id} training={training} user={user} />
          ))}

        {userTraining &&
          userTraining.completedTrainings!.map((training) => (
            <TrainingCard key={training.id} training={training} user={user} />
          ))}
      </section>
    </div>
  );
}
