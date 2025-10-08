// All data related to a single guess instance
export interface GuessData {
  guessId: number;
  paidGuess: boolean;
  overwrite: boolean;
  complex: boolean;
  blockIncrement: number;
  actualHash: string;
  secretHash: string;
  dummyHash: string;
  tokenSize: number;
  tokens: string[];
}
