export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  avatarColor: string;
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
}

export type ProtocolDraft = Omit<Protocol, "id" | "userId" | "createdAt" | "updatedAt">;

export const emptyDraft: ProtocolDraft = {
  question: "",
  materials: [],
  procedure: [],
  hypothesis: "",
  observation: "",
  result: "",
};
