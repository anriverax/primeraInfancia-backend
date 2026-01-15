export interface AnswerDetail {
  questionId: number;
  questionText: string;
  answerText: string;
}

export interface AppendixDetail {
  appendixId: number;
  dateCompleted: string;
  answersDetails: AnswerDetail[] | null;
}

export interface AppendixSummary {
  appendixId: number;
  appnedixName: string;
  numberOfTries: number;
}

export interface AnswerData {
  inscriptionId: number;
  fullName: string;
  appendixSummary: AppendixSummary[];
  appendixDetails: AppendixDetail[];
}
