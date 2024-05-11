export class AddSpeciesError {
  constructor(
    public readonly code: string = "server_error",
    public readonly message: string = "Server error",
    public readonly details: Array<{ message: string }> = [],
  ) {}
}
