const {
  DynamoDBClient,
  GetItemCommand,
  ListTablesCommand,
  DescribeTableCommand,
} = require("@aws-sdk/client-dynamodb");

const REGION = "eu-west-2";

const params = {
  TableName: "Music",
  Key: {
    Artist: { S: "Acme Band" },
    SongTitle: { S: "Happy Day" },
  },
};

const dbclient = new DynamoDBClient({ region: REGION });

const run = async () => {
  const data = await dbclient.send(new GetItemCommand(params));
  console.log("Success", data.Item);
};
run();

const run2 = async () => {
  try {
    const data = await dbclient.send(new ListTablesCommand({}));
    console.log(data.TableNames.join("\n"));
  } catch (err) {
    console.error(err);
  }
};
run2();

const run3 = async () => {
  try {
    const data = await dbclient.send(new DescribeTableCommand(params));
    console.log("Success", data.Table.KeySchema);
  } catch (err) {
    console.log("Error", err);
  }
};
run3();
