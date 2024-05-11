import "reflect-metadata";
import { Container } from "inversify";
import { Logger } from "@aws-lambda-powertools/logger";
import { Tracer } from "@aws-lambda-powertools/tracer";

import { TYPES } from "./types";
import { ListSpeciesHandler } from "../handlers/list-species/handler";
import { SpeciesService } from "../services/application/species.service";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynSwapiRepository } from "../services/clients/repositories/dyn-swapi.repository";
import axios, { AxiosInstance } from "axios";
import { SwapiApi } from "../services/clients/swapi/swapi-api";
import { AddSpeciesHandler } from "../handlers/add-species/handler";

export const buildContainer = (logger: Logger, tracer: Tracer, autor: string) => {
  const container = new Container();

  container
    .bind<AxiosInstance>(TYPES.AxiosInstance)
    .toDynamicValue(() => {
      return axios.create({
        baseURL: "https://swapi.py4e.com/api",
      });
    })
    .inRequestScope();

  container
    .bind<DynamoDBDocumentClient>(TYPES.DynamoDBDocumentClient)
    .toDynamicValue(() => {
      return DynamoDBDocumentClient.from(tracer.captureAWSv3Client(new DynamoDBClient({})), {
        marshallOptions: {
          convertClassInstanceToMap: true,
        },
      });
    })
    .inRequestScope();

  container.bind<Logger>(TYPES.Logger).toDynamicValue((context) => {
    return logger.createChild({
      persistentLogAttributes: {
        autor: autor || "unknown",
      },
    });
  });

  container.bind<string>(TYPES.SwapiTableName).toConstantValue(process.env.SWAPI_TABLE_NAME as string);

  container.bind<ListSpeciesHandler>(TYPES.ListSpeciesHandler).to(ListSpeciesHandler);
  container.bind<AddSpeciesHandler>(TYPES.AddSpeciesHandler).to(AddSpeciesHandler);
  container.bind<SpeciesService>(TYPES.SpeciesService).to(SpeciesService);
  container.bind<DynSwapiRepository>(TYPES.DynSwapiRepository).to(DynSwapiRepository);
  container.bind<SwapiApi>(TYPES.SwapiApi).to(SwapiApi);

  return container;
};
