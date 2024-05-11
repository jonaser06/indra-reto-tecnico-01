/**
 * @type {import('@shelf/jest-dynamodb/lib').Config}')}
 */
module.exports = {
  tables: [
    {
      TableName: "DYNAMODB_TABLE_SWAPI",
      KeySchema: [{ AttributeName: "id", KeyType: "HASH" }],
      AttributeDefinitions: [
        {
          AttributeName: "id",
          AttributeType: "S",
        },
      ],
      ProvisionedThroughput: { ReadCapacityUnits: 1, WriteCapacityUnits: 1 },
    },
  ],
  port: 8000,
};
