import "reflect-metadata";
import axios from "axios";
import nock, { Scope } from "nock";
import { mock } from "jest-mock-extended";

import { Logger } from "@aws-lambda-powertools/logger";
import { SwapiApi } from "../../../../src/services/clients/swapi/swapi-api";
import { SwapiApiError } from "../../../../src/services/domain/errors";

const logger = mock<Logger>();
const baseURL = "http://example.com";

const species = {
  id: "1",
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

describe("SwapiApi tests", () => {
  let scope: Scope;
  let swapiApi: SwapiApi;
  let speciesId = species.id;

  beforeEach(() => {
    swapiApi = new SwapiApi(logger, axios.create({ baseURL }));
    scope = nock(baseURL);
  });

  it("SwapiApi test", async () => {
    scope.get("/species/1").reply(200, species);
    await swapiApi.Species(speciesId);
  });

  it("SwapiApi test error", async () => {
    scope.get("/species/999").reply(500, { message: "Internal Server Error" });
    await expect(swapiApi.Species("999")).rejects.toBeInstanceOf(SwapiApiError);
  });
});
