export interface User {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  passwordSalt: string;
  avatar: string;
  teacherEmail?: string;
  schoolClass?: string;
  createdAt: string;
}

export type StepKey =
  | "question"
  | "materials"
  | "procedure"
  | "hypothesis"
  | "observation"
  | "result";

export type StepImages = Record<StepKey, string[]>;

export const emptyStepImages: StepImages = {
  question: [],
  materials: [],
  procedure: [],
  hypothesis: [],
  observation: [],
  result: [],
};

export interface Protocol {
  id: string;
  userId: string;
  question: string;
  materials: string[];
  procedure: string;
  hypothesis: string;
  observation: string;
  result: string;
  images: StepImages;
  createdAt: string;
  updatedAt: string;
  submittedAt?: string;
}

export type ProtocolDraft = Omit<
  Protocol,
  "id" | "userId" | "createdAt" | "updatedAt" | "submittedAt"
>;

export const emptyDraft: ProtocolDraft = {
  question: "",
  materials: [],
  procedure: "",
  hypothesis: "",
  observation: "",
  result: "",
  images: emptyStepImages,
};
