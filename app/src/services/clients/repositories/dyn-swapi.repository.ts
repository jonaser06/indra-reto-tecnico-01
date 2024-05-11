import { inject, injectable, targetName } from "inversify";
import { Logger } from "@aws-lambda-powertools/logger";
import { QueryCommand } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";
import { unmarshall } from "@aws-sdk/util-dynamodb";
import { ISwapi } from "../../domain/repositories/ISwapi";
import { TYPES } from "../../../common/types";
import { RepositoryError } from "../../domain/errors";

@injectable()
export class DynSwapiRepository implements ISwapi {
  constructor(
    @inject(TYPES.Logger) @targetName("DynSwapiRepository") private readonly logger: Logger,
    @inject(TYPES.DynamoDBDocumentClient) private readonly dynamoDBDocumentClient: DynamoDBDocumentClient,
    @inject(TYPES.SwapiTableName) private readonly swapiTableName: string,
  ) {}

  async listSpecies(id: string): Promise<any> {
    this.logger.debug(`listSpecies: ${this.swapiTableName}`);
    try {
      const queryCommand = new QueryCommand({
        TableName: this.swapiTableName,
        KeyConditionExpression: "id = :id",
        ExpressionAttributeValues: {
          ":id": { S: id },
        },
      });
      const queryCommandOutput = await this.dynamoDBDocumentClient.send(queryCommand);
      const items = queryCommandOutput.Items || [];
      return items.map((item) => unmarshall(item));
    } catch (error) {
      const repositoryError = new RepositoryError({
        message: error.name,
        details: [{ message: error.message }],
      });
      this.logger.error(`Error listSpecies`, repositoryError);
      throw repositoryError;
    }
  }

  async addSpecies(id: string, data: string): Promise<any> {
    this.logger.debug(`addSpecies: ${this.swapiTableName}`);
    try {
      const putCommand = new PutCommand({
        TableName: this.swapiTableName,
        Item: {
          id: id,
          data: data,
        },
      });

      const result = await this.dynamoDBDocumentClient.send(putCommand);
      return result;
    } catch (error) {
      const repositoryError = new RepositoryError({
        message: error.name,
        details: [{ message: error.message }],
      });
      this.logger.error(`Error addSpecies`, repositoryError);
      throw repositoryError;
    }
  }
}
