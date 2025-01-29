import { Types } from "mongoose";

export interface Users {
    email: string;
    image?: string;
    name?: string;
    questionsDone?: string[];
    totalScore?: number;
    role?: string;
  }
  
  export interface Questions {
    title: string;
    description: string;
    category: string;
    points: number;
    flag?: string;
    isSolved?: boolean;
    addilinks?: string;
    done: any;
    _id?: string;
    link?: string;
    // answeredCorrectly: { type: Boolean; default: false };
  }
  
  export interface UserQuestion {
    userId: Types.ObjectId,
    questionId: Types.ObjectId,
    scoredPoint: number,
    _id?: string;
  }