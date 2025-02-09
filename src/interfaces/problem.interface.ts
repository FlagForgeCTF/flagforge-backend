export interface IProblem extends Document {
  title: string;
  description: string;
  category: string;
  points: number;
  level: string;
  flag: string;
  addilinks?: string;
  hint?: string;
  link?: string;
  done?: boolean;
}