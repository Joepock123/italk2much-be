import AWS from "aws-sdk";
// const AWS = require("aws-sdk");

const REGION = "eu-west-2";

AWS.config.update({
  // endpoint: `https://dynamodb.${REGION}.amazonaws.com`,
  region: REGION,
});

export const documentClient = new AWS.DynamoDB.DocumentClient();
