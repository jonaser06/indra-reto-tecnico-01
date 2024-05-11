import { Logger } from "@aws-lambda-powertools/logger";
import { inject, injectable, targetName } from "inversify";
import { TYPES } from "../../common/types";

import { DynSwapiRepository } from "../clients/repositories/dyn-swapi.repository";
import { SwapiApi } from "../clients/swapi/swapi-api";
import { Species } from "../domain/model/species";
import { attributeTranslations } from "../../common/constant";
import { RepositoryError } from "../domain/errors";

@injectable()
export class SpeciesService {
  constructor(
    @inject(TYPES.Logger) @targetName("SpeciesService") private readonly logger: Logger,
    @inject(TYPES.DynSwapiRepository) private readonly dynSwapiRepository: DynSwapiRepository,
    @inject(TYPES.SwapiApi) private readonly swapiApi: SwapiApi,
  ) {}

  async listSpecies(id: string) {
    this.logger.info("listSpecies service called");
    let species = await this.dynSwapiRepository.listSpecies(id);
    let message = "Species found in the database";
    if (species.length === 0) {
      message = "Species found in SWAPI API";
      species = await this.swapiApi.Species(id);
      await this.addSpecies(id, JSON.stringify(species));
    } else {
      species = JSON.parse(species[0].data);
    }
    species = await this.translateSpecies(species);
    const response = { id, ...species };
    return { response, message };
  }

  async addSpecies(id: string, data: string) {
    this.logger.info("addSpecies service called");
    // find species in the database
    const species = await this.dynSwapiRepository.listSpecies(id);
    if (species.length > 0) {
      const repositoryError = new RepositoryError({
        message: "Species already exists in the database",
        details: [{ message: "Species already exists in the database" }],
      });
      throw repositoryError;
    }
    const addspecies = await this.dynSwapiRepository.addSpecies(id, data);
    return addspecies;
  }

  async translateSpecies(species: Species) {
    const response: Species = { ...species };
    const translated: Record<string, any> = {};

    for (const key in response) {
      if (key in attributeTranslations) {
        translated[attributeTranslations[key]] = response[key];
      } else {
        translated[key] = response[key];
      }
    }
    return translated;
  }
}
