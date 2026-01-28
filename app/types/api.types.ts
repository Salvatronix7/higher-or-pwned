export interface PwnedResponse {
  readonly hash: string;
  readonly count: number;
}

export interface ApiError {
  readonly message: string;
  readonly statusCode: number;
}
