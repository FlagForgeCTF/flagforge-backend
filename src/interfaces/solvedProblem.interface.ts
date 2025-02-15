import { Types } from 'mongoose';

export interface ISolvedProblem {
    user: Types.ObjectId; 
    problems: {
        problemID: Types.ObjectId;
        usedHint: boolean;
        solved:boolean;
    }[];
}