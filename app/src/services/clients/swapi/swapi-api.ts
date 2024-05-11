import { inject, injectable, targetName } from "inversify";
import { TYPES } from "../../../common/types";
import { Logger } from "@aws-lambda-powertools/logger";
import { AxiosInstance } from "axios";
import { ISwapiApi } from "../../domain/swapi/swapi";
import { Species } from "../../domain/model/species";
import { SwapiApiError } from "../../domain/errors";

@injectable()
export class SwapiApi implements ISwapiApi {
  constructor(
    @inject(TYPES.Logger) @targetName("SwapiApi") private readonly logger: Logger,
    @inject(TYPES.AxiosInstance) private readonly httpClient: AxiosInstance,
  ) {}

  Species(id: string): Promise<Species> {
    this.logger.debug("Getting species from swapi", { service: this.GetSpecies.name });
    const species = this.GetSpecies(id);
    return species;
  }

  async GetSpecies(id: string) {
    try {
      const { data } = await this.httpClient.get<Species>(`/species/${id}`);
      return data;
    } catch (error) {
      const swapiApiError = new SwapiApiError({
        details: [{ message: error.message }],
      });
      this.logger.error(`Error getting species from swapi: ${error.code}`, swapiApiError);
      throw swapiApiError;
    }
  }
}
