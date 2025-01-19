"use client";
import {
  deleteTraining,
  markAsAbsent,
  participateToTraining,
  unParticipateToTraining,
} from "@/actions/training";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

import { UserRole } from "@/types/UserRole";
import { Training, User } from "@prisma/client";
import { Ban, Check, Loader, Timer } from "lucide-react";
import { useEffect, useState } from "react";
import { MdOutlinePersonSearch } from "react-icons/md";
import { PiSneaker } from "react-icons/pi";
import { AbsentsCardView } from "./AbsentsCardView";
import { ParticipantsCardView } from "./ParticipantsCardView";

interface TrainingCardProps {
  training: Training & { participants: User[]; absents: User[] };
  user: User;
}

export const TrainingCard = ({ training, user }: TrainingCardProps) => {
  const [isParticipating, setIsParticipating] = useState<boolean>(false);

  const [isAbsent, setIsAbsent] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");
  const [httpStatus, setHttpStatus] = useState<number>(0);
  const [totalParticipants, setTotalParticipants] = useState<number>(
    training.participants.length
  );
  const [participants, setParticipants] = useState<User[]>(
    training.participants
  );
  const [absents, setAbsents] = useState<User[]>(training.absents);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);

  useEffect(() => {
    const _date = new Date(training.date);
    _date.setHours(_date.getHours() + 2);
    if (new Date() > _date) {
      setIsCompleted(true);
    }
    if (user && user.role === UserRole.USER) {
      setIsLoading(true);
      const _absents = training.absents.some((p) => p.id === user.id);
      const _participants = training.participants.some((p) => p.id === user.id);
      console.log(_absents, _participants);
      setIsAbsent(_absents);
      setIsParticipating(_participants);
      setIsLoading(false);
    }
    if (user && user.role === UserRole.COACH) {
    }
    setParticipants(training.participants);
    setTotalParticipants(training.participants.length);
    setAbsents(training.absents);
  }, [training.participants, user, training.absents, training.date]);

  const handleParticipate = async () => {
    setIsLoading(true);
    const response = await participateToTraining(training.id, user.id);
    if (response.status === 200) {
      setIsParticipating(true);
      setHttpStatus(response.status);
      setMessage(response.message);
      setIsAbsent(false);
      const newAbsents = absents.filter((p) => p.id !== user.id);
      setTotalParticipants(totalParticipants + 1);
      setAbsents(newAbsents);
      setParticipants([...participants, user]);
    } else {
      setIsParticipating(false);
      setHttpStatus(response.status);
      setMessage(response.message);
    }
    setTimeout(() => {
      setMessage("");
      setIsLoading(false);
    }, 2500);
  };

  const handleUnParticipate = async () => {
    setIsLoading(true);
    const response = await unParticipateToTraining(training.id, user.id);
    if (response.status === 200) {
      setIsParticipating(false);
      setHttpStatus(response.status);
      setMessage(response.message);
      const newParticipants = participants.filter((p) => p.id !== user.id);
      setTotalParticipants(newParticipants.length);
      setParticipants(newParticipants);
    } else {
      setIsParticipating(true);
    }
    setIsLoading(false);
    setTimeout(() => {
      setMessage("");
    }, 2500);
  };

  const handleDeleteTraining = async () => {
    const response = await deleteTraining(training.id);
    if (response.status === 200) {
      setMessage(response.message);
    } else {
      setMessage(response.message);
    }
    setTimeout(() => {
      setMessage("");
      window.location.reload();
    }, 2500);
  };

  const handleMarkAsAbsent = async () => {
    setIsLoading(true);
    const response = await markAsAbsent(training.id, user.id);
    console.log(response);
    if (response.status === 200) {
      setIsAbsent(true);
      setIsParticipating(false);
      const newParticipants = participants.filter((p) => p.id !== user.id);
      setTotalParticipants(newParticipants.length);
      setParticipants(newParticipants);
      setAbsents([...absents, user]);
      setHttpStatus(response.status);
      setMessage(response.message);
    } else {
      setIsAbsent(false);
    }

    setIsLoading(false);
    setTimeout(() => {
      setMessage("");
    }, 2500);
  };

  return (
    <div
      key={training.id}
      className="space-y-2 border rounded p-6 shadow bg-card"
    >
      <h3 className="flex items-center gap-2 uppercase font-bold">
        {training.date.toLocaleDateString("fr-FR", {
          day: "numeric",
          month: "long",
          year: "numeric",
        })}
      </h3>
      <p className="flex items-center gap-2">
        <Timer />{" "}
        {new Date(training.date.getTime() - 60 * 60 * 1000).toLocaleTimeString(
          "fr-FR",
          {
            hour: "2-digit",
            minute: "2-digit",
          }
        )}
        {isCompleted && training.participants.length > 6 ? (
          <span className="px-2 py-1 bg-green-50 text-green-600 rounded-xl text-sm flex items-center gap-2">
            Entrainement terminé <Check />
          </span>
        ) : isCompleted && training.participants.length < 6 ? (
          <span className="px-2 py-1 bg-red-50 text-red-600 rounded-xl text-sm flex items-center gap-2">
            Entrainement annulé <Ban />
          </span>
        ) : !isCompleted && training.participants.length > 6 ? (
          <span className="px-2 py-1 bg-amber-50 text-amber-600 rounded-xl text-sm flex items-center gap-2">
            En préparation <PiSneaker />
          </span>
        ) : !isCompleted && training.participants.length < 6 ? (
          <span className="px-2 py-1 bg-amber-50 text-amber-600 rounded-xl text-sm flex items-center gap-2">
            En attente de {6 - totalParticipants} joueur(s) pour confirmer{" "}
            <MdOutlinePersonSearch />
          </span>
        ) : null}
      </p>
      <p>{training.description}</p>
      {isParticipating && !isCompleted ? (
        <p className="text-green-600 font-thin text-sm italic">
          Vous avez indiqué{" "}
          <span className="font-bold tracking-wide">
            particper à cet entrainement
          </span>
        </p>
      ) : isParticipating && isCompleted ? (
        <p className="text-green-600 font-thin text-sm italic">
          Vous avez{" "}
          <span className="font-bold tracking-wide">
            participé à cet entrainement
          </span>
        </p>
      ) : null}
      {isAbsent && (
        <p className="text-amber-600 font-thin text-sm italic">
          Vous avez indiqué être{" "}
          <span className="font-bold tracking-wide">absent</span>
        </p>
      )}
      <section className="rounded-lg p-2 text-sm group relative">
        <p>
          Nombre de participants :{" "}
          <span
            className={`
              ${totalParticipants < 6 ? "text-amber-600" : "text-green-600"}
              font-bold text-lg`}
          >
            {totalParticipants}
          </span>
        </p>
        <section className="hidden group-hover:block absolute top-0 right-0 z-50">
          <ParticipantsCardView participants={participants} />
        </section>
      </section>
      <section className="rounded-lg p-2 text-sm group relative">
        <p>
          Nombre d&apos;absents :{" "}
          <span className={`font-bold text-lg`}>{absents.length}</span>
        </p>
        <section className="hidden group-hover:block absolute top-0 right-0 z-50">
          <AbsentsCardView absents={absents} />
        </section>
      </section>
      {!isCompleted && (
        <section className="relative z-30">
          {user.role === UserRole.USER && (
            <section className="flex flex-row-reverse justify-start gap-4">
              {!isParticipating && !isAbsent ? (
                <Button
                  variant={"trainingRegister"}
                  size="sm"
                  onClick={handleParticipate}
                  type="button"
                  className="min-w-32"
                >
                  {isLoading ? (
                    <Loader className="animate-spin" />
                  ) : (
                    "S'inscrire"
                  )}
                </Button>
              ) : !isParticipating && isAbsent ? (
                <Button
                  variant={"trainingRegister"}
                  size="sm"
                  onClick={handleParticipate}
                  type="button"
                  className="min-w-32"
                >
                  {isLoading ? (
                    <Loader className="animate-spin" />
                  ) : (
                    "S'inscrire"
                  )}
                </Button>
              ) : (
                <Button
                  variant={"trainingRegisterDisabled"}
                  size="sm"
                  type="button"
                  onClick={handleUnParticipate}
                  className="min-w-32"
                >
                  {isLoading ? (
                    <Loader className="animate-spin" />
                  ) : (
                    "Se désinscrire"
                  )}
                </Button>
              )}
              {!isAbsent ? (
                <Button
                  variant={"trainingRegisterDisabled"}
                  size="sm"
                  onClick={handleMarkAsAbsent}
                  type="button"
                  className="min-w-32"
                >
                  {isLoading ? (
                    <Loader className="animate-spin" />
                  ) : (
                    "Je serais absent"
                  )}
                </Button>
              ) : null}
            </section>
          )}
        </section>
      )}

      {user.role === UserRole.COACH && (
        <section className="flex justify-end">
          <Button
            variant={"trainingDelete"}
            size="sm"
            type="button"
            onClick={handleDeleteTraining}
          >
            Supprimer
          </Button>
        </section>
      )}
      <section className=" w-full">
        {message && isParticipating && (
          <Alert
            variant={httpStatus === 200 ? "success" : "destructive"}
            className="z-50 absolute top-0 right-0"
          >
            <AlertTitle>
              {httpStatus === 200 ? "Incription réussie" : "Erreur"}
            </AlertTitle>
            <AlertDescription>{message}</AlertDescription>
          </Alert>
        )}
        {message && isParticipating && (
          <Alert
            variant={httpStatus === 200 ? "success" : "destructive"}
            className="z-50 absolute top-0 right-0"
          >
            <AlertTitle>
              {httpStatus === 200 ? "Incription réussie" : "Erreur"}
            </AlertTitle>
            <AlertDescription>{message}</AlertDescription>
          </Alert>
        )}
        {message && !isParticipating && (
          <Alert
            variant={httpStatus === 200 ? "success" : "destructive"}
            className="z-50 absolute top-0 right-0"
          >
            <AlertTitle>
              {httpStatus === 200 ? "Desinscription réussie" : "Erreur"}
            </AlertTitle>
            <AlertDescription>{message}</AlertDescription>
          </Alert>
        )}
        {message && !isParticipating && (
          <Alert
            variant={httpStatus === 200 ? "success" : "destructive"}
            className="z-50 absolute top-0 right-0"
          >
            <AlertTitle>
              {httpStatus === 200 ? "Desinscription réussie" : "Erreur"}
            </AlertTitle>
            <AlertDescription>{message}</AlertDescription>
          </Alert>
        )}
      </section>
    </div>
  );
};
