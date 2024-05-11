import "reflect-metadata";
import { mock } from "jest-mock-extended";

import { Logger } from "@aws-lambda-powertools/logger";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DeleteCommand, DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";
import { DynSwapiRepository } from "../../../../src/services/clients/repositories/dyn-swapi.repository";
import { RepositoryError } from "../../../../src/services/domain/errors";

const logger = mock<Logger>();

const tableName = "DYNAMODB_TABLE_SWAPI";

const dynamoDBDocumentClient = DynamoDBDocumentClient.from(
  new DynamoDBClient({
    endpoint: "http://localhost:8000",
    region: "local",
  }),
);

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

describe("DynSwapiRepository tests", () => {
  let dynSwapiRepository: DynSwapiRepository;
  let speciesId: string;

  beforeAll(async () => {
    speciesId = species.id;
    await dynamoDBDocumentClient.send(
      new PutCommand({
        TableName: tableName,
        Item: species,
      }),
    );
  });

  it("DynSwapiRepository should return data", async () => {
    dynSwapiRepository = new DynSwapiRepository(logger, dynamoDBDocumentClient, tableName);
    const result = await dynSwapiRepository.listSpecies(speciesId);
    expect(result).toEqual([species]);
  });

  it("DynSwapiRepository should save data", async () => {
    const newspecies = { ...species, id: "10" };
    dynSwapiRepository = new DynSwapiRepository(logger, dynamoDBDocumentClient, tableName);
    await dynSwapiRepository.addSpecies(newspecies.id, JSON.stringify(newspecies));
    const result = await dynSwapiRepository.listSpecies(newspecies.id);
    expect(JSON.parse(result[0].data)).toEqual(newspecies);
  });

  it("DynSwapiRepository should throw an error when table not exists", async () => {
    const wrongTableName = "WRONG_TABLE_NAME";
    dynSwapiRepository = new DynSwapiRepository(logger, dynamoDBDocumentClient, wrongTableName);
    await expect(dynSwapiRepository.listSpecies(speciesId)).rejects.toThrow(RepositoryError);
  });
});
