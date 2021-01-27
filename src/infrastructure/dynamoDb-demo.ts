// const AWS = require("aws-sdk");

// const REGION = "eu-west-2";

// AWS.config.update({
//   endpoint: "https://dynamodb.eu-west-2.amazonaws.com",
//   region: REGION,
// });

// const docClient = new AWS.DynamoDB.DocumentClient();

// const table = "Music";

// const Artist1 = "Acme Band";
// const SongTitle1 = "Happy Day";

// const Artist2 = "Tiny T";
// const SongTitle2 = "Sold ya";

// const params1 = {
//   TableName: table,
//   Key: {
//     Artist: Artist1,
//     SongTitle: SongTitle1,
//   },
// };

// // @ts-ignore
// docClient.get(params1, (err, data) => {
//   if (err) {
//     console.error(
//       "Unable to read item. Error JSON:",
//       JSON.stringify(err, null, 2)
//     );
//   } else {
//     console.log("data", data);
//     console.log("GetItem succeeded:", JSON.stringify(data, null, 2));
//   }
// });

// const params2 = {
//   TableName: table,
//   Item: {
//     Artist: Artist2,
//     SongTitle: SongTitle2,
//   },
// };

// console.log("Adding a new item...");
// // @ts-ignore
// docClient.put(params2, (err, data) => {
//   if (err) {
//     console.error(
//       "Unable to add item. Error JSON:",
//       JSON.stringify(err, null, 2)
//     );
//   } else {
//     console.log("data", data);
//     console.log("Added item:", JSON.stringify(data, null, 2));
//   }
// });
