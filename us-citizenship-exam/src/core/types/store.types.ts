/**
 * Store-related types
 */

export interface QuizStoreState {
  answersByQuestionId: Record<string, string>;
  setAnswer: (questionId: string, answer: string) => void;
  setAllAnswers: (map: Record<string, string>) => void;
  reset: () => void;
  starredIds: Set<string>;
  toggleStar: (id: string) => void;
  isStarred: (id: string) => boolean;
  lastIncorrectIds: Set<string>;
  setIncorrect: (ids: string[]) => void;
}

export interface UserProgressState {
  // Reserved for future user progress tracking
  // This can be extended when user authentication is added
  _reserved?: never;
}
