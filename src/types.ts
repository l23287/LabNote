export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  avatar: string;
  teacherEmail?: string;
  createdAt: string;
}

export interface Protocol {
  id: string;
  userId: string;
  question: string;
  materials: string[];
  procedure: string[];
  hypothesis: string;
  observation: string;
  result: string;
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
  procedure: [],
  hypothesis: "",
  observation: "",
  result: "",
};
