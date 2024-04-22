const fs = require("fs");
const path = require("path");
const AWS = require("aws-sdk");
const s3 = new AWS.S3()

const saveNum = async (favNumber) => {
  console.log("saving");
  await s3.putObject({
    Body: JSON.stringify(favNumber, null, 2),
    Bucket: "cyclic-fuzzy-bull-umbrella-eu-north-1",
    Key: "number.json",
  }).promise()
};

const saveText = async (favText) => {
  console.log("saving");
  await s3.putObject({
    Body: JSON.stringify(favText, null, 2),
    Bucket: "cyclic-fuzzy-bull-umbrella-eu-north-1",
    Key: "text.json",
  }).promise()
};

module.exports = { saveNum, saveText };