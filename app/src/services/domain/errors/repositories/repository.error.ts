type RepositoryErrorInput = {
  code: string;
  message: string;
  details: Array<{ message: string }>;
};

export class RepositoryError extends Error {
  public readonly code: string;
  public readonly details: Array<{ message: string }>;

  constructor({
    code = "server_error",
    message = "An unexpected error has ocurred retrieving data",
    details = [],
  }: Partial<RepositoryErrorInput>) {
    super();
    this.code = code;
    this.message = message;
    this.details = details;
  }
}
