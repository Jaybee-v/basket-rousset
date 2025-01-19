"use client";
import { getWeeklyTraining } from "@/actions/training";
import { Button } from "@/components/ui/button";
import { Training, User } from "@prisma/client";
import { ArrowLeft, ArrowRight, Loader } from "lucide-react";
import { useEffect, useState } from "react";
import { TrainingCard } from "./TrainingCard";

type WeeklyTrainingsViewProps = {
  user: User;
};

export const WeeklyTrainingsView = ({ user }: WeeklyTrainingsViewProps) => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [trainings, setTrainings] = useState<
    (Training & { participants: User[]; absents: User[] })[]
  >([]);
  const [completedTrainings, setCompletedTrainings] = useState<
    (Training & { participants: User[]; absents: User[] })[]
  >([]);
  const [startWeek, setStartWeek] = useState<Date>(new Date());
  const [endWeek, setEndWeek] = useState<Date>(new Date());
  const [isPending, setIsPending] = useState<boolean>(false);

  useEffect(() => {
    fetchTrainings(selectedDate);
  }, [selectedDate]);

  const fetchTrainings = async (date: Date) => {
    setIsPending(true);
    const response = await getWeeklyTraining(date);
    setTrainings(response.trainings);
    setStartWeek(response.startWeek);
    setEndWeek(response.endWeek);
    setTimeout(() => {
      setIsPending(false);
    }, 900);
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-center">
        Semaine du{" "}
        {startWeek.toLocaleDateString("fr-FR", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        })}{" "}
        au{" "}
        {endWeek.toLocaleDateString("fr-FR", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        })}
      </h2>
      <section className="flex items-center gap-2 justify-center">
        <Button
          variant={"link"}
          type="button"
          onClick={() =>
            setSelectedDate(
              new Date(startWeek.setDate(startWeek.getDate() - 7))
            )
          }
        >
          <ArrowLeft />
          Semaine précédente
        </Button>
        -
        <Button
          variant={"link"}
          type="button"
          onClick={() =>
            setSelectedDate(
              new Date(startWeek.setDate(startWeek.getDate() + 7))
            )
          }
        >
          Semaine suivante <ArrowRight />
        </Button>
      </section>
      <section className="space-y-4">
        {isPending && (
          <section className="h-32 w-full flex justify-center items-center">
            <Loader className="animate-spin" />
          </section>
        )}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {!isPending &&
            trainings.length > 0 &&
            trainings.map((training) => (
              <TrainingCard key={training.id} training={training} user={user} />
            ))}
        </section>
        {!isPending && trainings.length === 0 && (
          <p className="text-center text-sm text-gray-500 mt-6">
            Aucune séance programmée pour cette semaine
          </p>
        )}
      </section>
    </div>
  );
};
