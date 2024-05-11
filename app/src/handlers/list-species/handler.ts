import middy from "@middy/core";
import { Context } from "aws-lambda";
import { Logger, injectLambdaContext } from "@aws-lambda-powertools/logger";
import { Tracer, captureLambdaHandler } from "@aws-lambda-powertools/tracer";
import { inject, injectable, targetName } from "inversify";

import { SpeciesService } from "../../services/application/species.service";
import { RepositoryError, SwapiApiError } from "../../services/domain/errors";
import { errorMiddleware } from "../../common/middleware/error.middleware";
import { TYPES } from "../../common/types";
import { buildContainer } from "../../common/container";
import { ListSpeciesOutput } from "./output";
import { ListSpeciesInput } from "./input";
import { ListSpeciesError } from "./error";

@injectable()
export class ListSpeciesHandler {
  constructor(
    @inject(TYPES.Logger) @targetName("ListSpeciesHandler") private readonly logger: Logger,
    @inject(TYPES.SpeciesService) private readonly speciesService: SpeciesService,
  ) {}

  async handler(event: ListSpeciesInput): Promise<ListSpeciesOutput> {
    try {
      this.logger.info("Querying species...");
      const { response, message } = await this.speciesService.listSpecies(event.id);
      return {
        code: "ok",
        message: message,
        details: response,
      };
    } catch (error) {
      let swapiApiError: ListSpeciesError = new ListSpeciesError();
      if (error instanceof SwapiApiError || error instanceof RepositoryError) {
        swapiApiError = new ListSpeciesError(error.code, error.message, error.details);
      }
      this.logger.error("Error querying species", error);
      throw swapiApiError;
    }
  }
}

const logger = new Logger();
const tracer = new Tracer();

export const handler = middy(async (event: ListSpeciesInput, context: Context): Promise<ListSpeciesOutput> => {
  const container = buildContainer(logger, tracer, "Jonathan");
  const handler = container.get<ListSpeciesHandler>(TYPES.ListSpeciesHandler);
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
