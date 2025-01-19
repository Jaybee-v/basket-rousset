import { TrainingStatus } from "./TrainingStatus";

export type Training = {
  id: string;
  date: Date;
  description: string | null;
  status: TrainingStatus;
  createdAt: Date;
  updatedAt: Date;
};
