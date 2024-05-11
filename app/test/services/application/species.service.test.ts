import "reflect-metadata";
import { mock } from "jest-mock-extended";

import { Logger } from "@aws-lambda-powertools/logger";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DeleteCommand, DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";

import { DynSwapiRepository } from "../../../src/services/clients/repositories/dyn-swapi.repository";
import { SpeciesService } from "../../../src/services/application/species.service";
import { SwapiApi } from "../../../src/services/clients/swapi/swapi-api";
import { RepositoryError } from "../../../src/services/domain/errors";

const logger = mock<Logger>();
const swapiApi = mock<SwapiApi>();
const dynSwapiRepository = mock<DynSwapiRepository>();

const species = {
  id: "9",
  name: "Trandoshan",
  classification: "reptile",
  designation: "sentient",
  average_height: "200",
  skin_colors: "brown, green",
  hair_colors: "none",
  eye_colors: "yellow, orange",
  average_lifespan: "unknown",
  homeworld: "https://swapi.py4e.com/api/planets/29/",
  language: "Dosh",
  people: ["https://swapi.py4e.com/api/people/24/"],
  films: ["https://swapi.py4e.com/api/films/2/"],
  created: "2014-12-15T13:07:47.704000Z",
  edited: "2014-12-20T21:36:42.151000Z",
  url: "https://swapi.py4e.com/api/species/7/",
};

describe("SpeciesService tests", () => {
  let speciesService: SpeciesService;
  let speciesId: string;

  beforeEach(async () => {
    speciesId = species.id;
    speciesService = new SpeciesService(logger, dynSwapiRepository, swapiApi);
  });

  it("should list species", async () => {
    const mockSpecies = [
      {
        id: "9",
        data: JSON.stringify(species),
      },
    ];
    dynSwapiRepository.listSpecies.mockResolvedValue(mockSpecies);
    const result = await speciesService.listSpecies(speciesId);
    const translatedSpecies = await speciesService.translateSpecies(species);
    expect(result.response).toEqual(translatedSpecies);
  });

  it("should translate species attributes correctly", async () => {
    const translatedSpecies = await speciesService.translateSpecies(species);
    expect(translatedSpecies.nombre).toEqual(species.name);
    expect(translatedSpecies.clasificacion).toEqual(species.classification);
    expect(translatedSpecies.designacion).toEqual(species.designation);
    expect(translatedSpecies.altura_promedio).toEqual(species.average_height);
    expect(translatedSpecies.colores_de_piel).toEqual(species.skin_colors);
    expect(translatedSpecies.colores_de_cabello).toEqual(species.hair_colors);
    expect(translatedSpecies.colores_de_ojos).toEqual(species.eye_colors);
    expect(translatedSpecies.esperanza_de_vida_promedio).toEqual(species.average_lifespan);
    expect(translatedSpecies.planeta_natal).toEqual(species.homeworld);
    expect(translatedSpecies.idioma).toEqual(species.language);
    expect(translatedSpecies.personas).toEqual(species.people);
    expect(translatedSpecies.peliculas).toEqual(species.films);
    expect(translatedSpecies.creado).toEqual(species.created);
    expect(translatedSpecies.editado).toEqual(species.edited);
    expect(translatedSpecies.url).toEqual(species.url);
  });
});
