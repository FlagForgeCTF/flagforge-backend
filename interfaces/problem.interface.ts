export interface IProblem extends Document {
    title: string;
    description: string;
    category: string;
    points: number;
    flag: string;
    addilinks?: string;
    link?: string;
    done?: boolean;
  }