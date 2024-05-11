import middy from "@middy/core";
import { Context } from "aws-lambda";
import { Logger, injectLambdaContext } from "@aws-lambda-powertools/logger";
import { Tracer, captureLambdaHandler } from "@aws-lambda-powertools/tracer";

import { inject, injectable, targetName } from "inversify";
import { buildContainer } from "../../common/container";
import { TYPES } from "../../common/types";
import { SpeciesService } from "../../services/application/species.service";
import { AddSpeciesError } from "./error";
import { RepositoryError, SwapiApiError } from "../../services/domain/errors";
import { AddSpeciesOutput } from "./output";
import { AddSpeciesInput } from "./input";
import { errorMiddleware } from "../../common/middleware/error.middleware";

@injectable()
export class AddSpeciesHandler {
  constructor(
    @inject(TYPES.Logger) @targetName("AddSpeciesHandler") private readonly logger: Logger,
    @inject(TYPES.SpeciesService) private readonly speciesService: SpeciesService,
  ) {}

  async handler(event: AddSpeciesInput): Promise<AddSpeciesOutput> {
    try {
      this.logger.info("Querying species...");
      const { id, ...payload } = event;
      const id_ = event.id;
      const { $metadata } = await this.speciesService.addSpecies(id_, JSON.stringify(payload));
      return {
        code: "ok",
        message: "Query successfully executed",
        details: $metadata.requestId,
      };
    } catch (error) {
      let swapiApiError: AddSpeciesError = new AddSpeciesError();
      if (error instanceof RepositoryError) {
        swapiApiError = new AddSpeciesError(error.code, error.message, error.details);
      }
      this.logger.error("Error querying species", error);
      throw swapiApiError;
    }
  }
}

const logger = new Logger();
const tracer = new Tracer();

export const handler = middy(async (event: AddSpeciesInput, context: Context): Promise<AddSpeciesOutput> => {
  const container = buildContainer(logger, tracer, "Jonathan");
  const handler = container.get<AddSpeciesHandler>(TYPES.AddSpeciesHandler);
  const reponse = await handler.handler(event);
  return reponse;
})
  .use(injectLambdaContext(logger, { clearState: true }))
  .use(captureLambdaHandler(tracer))
  .use(
    errorMiddleware({
      getErrorCode: (error: Error) => {
        if (error instanceof SwapiApiError) {
          return "server_error";
        }
        if (error instanceof RepositoryError) {
          return "repository_error";
        }
        return "internal_error";
      },
    }),
  );
