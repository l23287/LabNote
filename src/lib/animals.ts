export interface Animal {
  id: string;
  emoji: string;
  label: string;
  bg: string;
}

export const ANIMALS: Animal[] = [
  { id: "fox", emoji: "🦊", label: "Fuchs", bg: "#ff9d63" },
  { id: "bear", emoji: "🐻", label: "Bär", bg: "#b98457" },
  { id: "panda", emoji: "🐼", label: "Panda", bg: "#8fa89c" },
  { id: "frog", emoji: "🐸", label: "Frosch", bg: "#6fbf73" },
  { id: "koala", emoji: "🐨", label: "Koala", bg: "#9aa5b1" },
  { id: "lion", emoji: "🦁", label: "Löwe", bg: "#ffc94d" },
  { id: "monkey", emoji: "🐵", label: "Affe", bg: "#c98a5e" },
  { id: "rabbit", emoji: "🐰", label: "Hase", bg: "#f4a6b9" },
  { id: "tiger", emoji: "🐯", label: "Tiger", bg: "#ff9d42" },
  { id: "cat", emoji: "🐱", label: "Katze", bg: "#8fb3d9" },
  { id: "owl", emoji: "🦉", label: "Eule", bg: "#a988c9" },
  { id: "penguin", emoji: "🐧", label: "Pinguin", bg: "#5fb8b0" },
  { id: "elephant", emoji: "🐘", label: "Elefant", bg: "#a3aab8" },
  { id: "turtle", emoji: "🐢", label: "Schildkröte", bg: "#4f9e7a" },
  { id: "dog", emoji: "🐶", label: "Hund", bg: "#d9a35f" },
  { id: "cow", emoji: "🐮", label: "Kuh", bg: "#e8c9a0" },
  { id: "unicorn", emoji: "🦄", label: "Einhorn", bg: "#d9a8e0" },
  { id: "hedgehog", emoji: "🦔", label: "Igel", bg: "#a67c52" },
];

export function getAnimal(id: string | undefined): Animal {
  return ANIMALS.find((a) => a.id === id) ?? ANIMALS[0];
}

export function randomAnimalId(): string {
  return ANIMALS[Math.floor(Math.random() * ANIMALS.length)].id;
}
