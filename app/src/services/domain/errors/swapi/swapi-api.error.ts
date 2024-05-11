type SwapiApiErrorInput = {
  code: string;
  message: string;
  details: Array<{ message: string }>;
};

export class SwapiApiError extends Error {
  public readonly code: string;
  public readonly details: Array<{ message: string }>;

  constructor({
    code = "swapi-api-error",
    message = "An error occurred while trying to fetch data from the SWAPI API",
    details = [],
  }: Partial<SwapiApiErrorInput>) {
    super();
    this.code = code;
    this.message = message;
    this.details = details;
  }
}
