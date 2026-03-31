export interface Todo {
  id: string;
  title: string;
  completed: boolean;
  createdAt: string;
  hash: string;
  previousHash: string;
}

export interface ChainStatus {
  valid: boolean;
  message: string;
}
