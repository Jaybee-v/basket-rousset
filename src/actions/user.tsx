"use server";

import { prisma } from "@/lib/prisma";
import { TrainingStatus } from "@/types/TrainingStatus";

export const findUserTraining = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      trainings: {
        include: {
          participants: true,
          absents: true,
        },
      },
    },
  });

  const total = user?.trainings.length;

  const completedTrainings = user?.trainings.filter(
    (training) => training.status === TrainingStatus.COMPLETED
  );

  const totalParticipants = user?.trainings.reduce(
    (acc, training) => acc + training.participants.length,
    0
  );

  const totalAbsents = user?.trainings.reduce(
    (acc, training) => acc + training.absents.length,
    0
  );

  return {
    total,
    totalParticipants,
    totalAbsents,
    completedTrainings,
    user: user,
  };
};
