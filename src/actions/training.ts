"use server";

import { TrainingFormSchema } from "@/lib/definitions/training.definitions";
import { prisma } from "@/lib/prisma";

export async function createTraining(formData: FormData) {
  const _date = new Date(formData.get("date") as string);

  const validatedFields = TrainingFormSchema.safeParse({
    date: _date,
    description: formData.get("description"),
  });

  if (!validatedFields.success) {
    return { errors: validatedFields.error.flatten().fieldErrors };
  }

  const { date, description } = validatedFields.data;

  if (date < new Date()) {
    return {
      status: 400,
      message: "Vous ne pouvez pas planifier une séance dans le passé",
    };
  }

  const training = await prisma.training.create({
    data: {
      date,
      description,
    },
  });

  if (training) {
    return {
      status: 201,
      message: "Séance planifiée avec succès",
    };
  }
}

export async function getWeeklyTraining(date: Date) {
  const startWeek = new Date(date);
  startWeek.setDate(date.getDate() - date.getDay() + 1);
  startWeek.setHours(0, 0, 0, 0);

  const endWeek = new Date(startWeek);
  endWeek.setDate(startWeek.getDate() + 6);
  endWeek.setHours(23, 59, 59, 999);

  const trainings = await prisma.training.findMany({
    where: {
      date: {
        gte: startWeek,
        lte: endWeek,
      },
    },
    include: {
      participants: true,
      absents: true,
    },
  });

  return {
    trainings: trainings,
    startWeek,
    endWeek,
  };
}

export async function participateToTraining(
  trainingId: string,
  userId: string
) {
  const training = await prisma.training.findUnique({
    where: { id: trainingId },
    include: {
      participants: true,
      absents: true,
    },
  });

  if (!training) {
    return {
      status: 404,
      message: "Séance non trouvée",
    };
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    return {
      status: 404,
      message: "Utilisateur non trouvé",
    };
  }

  const isParticipating = training.participants.some(
    (participant) => participant.id === user.id
  );

  const isAbsent = training.absents.some((absent) => absent.id === user.id);

  console.log(isParticipating, isAbsent);

  if (isParticipating) {
    return {
      status: 400,
      message: "Vous participez déjà à cette séance",
    };
  }

  if (isAbsent) {
    await prisma.training.update({
      where: { id: trainingId },
      data: {
        absents: { disconnect: { id: userId } },
      },
    });
  }

  const updatedTraining = await prisma.training.update({
    where: { id: trainingId },
    data: {
      participants: {
        connect: { id: userId },
      },
    },
    include: {
      participants: true,
    },
  });

  if (updatedTraining) {
    return {
      status: 200,
      message: "Vous venez de valider votre participation à cette séance",
    };
  } else {
    return {
      status: 500,
      message: "Une erreur est survenue lors de l'inscription",
    };
  }
}

export async function unParticipateToTraining(
  trainingId: string,
  userId: string
) {
  const training = await prisma.training.findUnique({
    where: { id: trainingId },
    include: {
      participants: true,
    },
  });

  if (!training) {
    return {
      status: 404,
      message: "Séance non trouvée",
    };
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    return {
      status: 404,
      message: "Utilisateur non trouvé",
    };
  }

  const isParticipating = training.participants.some(
    (participant) => participant.id === user.id
  );

  if (!isParticipating) {
    return {
      status: 400,
      message: "Vous ne participez pas à cette séance",
    };
  }

  await prisma.training.update({
    where: { id: trainingId },
    data: {
      participants: {
        disconnect: { id: userId },
      },
    },
    include: {
      participants: true,
    },
  });

  return {
    status: 200,
    message: "Vous venez de vous désinscrire de cette séance",
  };
}

export const deleteTraining = async (trainingId: string) => {
  const training = await prisma.training.findUnique({
    where: { id: trainingId },
  });

  if (!training) {
    return {
      status: 404,
      message: "Séance non trouvée",
    };
  }

  await prisma.training.delete({
    where: { id: trainingId },
  });

  return {
    status: 200,
    message: "Séance supprimée avec succès",
  };
};

export const markAsAbsent = async (trainingId: string, userId: string) => {
  const training = await prisma.training.findUnique({
    where: { id: trainingId },
    include: {
      absents: true,
      participants: true,
    },
  });

  if (!training) {
    return {
      status: 404,
      message: "Séance non trouvée",
    };
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    return {
      status: 404,
      message: "Utilisateur non trouvé",
    };
  }

  const isAbsent = training.absents.some((absent) => absent.id === user.id);
  const isParticipating = training.participants.some(
    (participant) => participant.id === user.id
  );

  if (isParticipating) {
    await prisma.training.update({
      where: { id: trainingId },
      data: {
        participants: {
          disconnect: { id: userId },
        },
      },
    });
  }

  if (isAbsent) {
    return {
      status: 400,
      message: "Vous êtes déjà absent à cette séance",
    };
  }

  await prisma.training.update({
    where: { id: trainingId },
    data: { absents: { connect: { id: userId } } },
  });

  return {
    status: 200,
    message: "Vous êtes marqué absent à cette séance",
  };
};
