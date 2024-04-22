const { Router } = require("express");
const { saveNum, saveText } = require("../save_json");
let favouriteNumber = require("../number.json");
const add = require("../add");
const AWS = require("aws-sdk");
const s3 = new AWS.S3()

const router = new Router();

router.get("/favText", async (req, res) => {
  let my_file = await s3.getObject({
    Bucket: "cyclic-fuzzy-bull-umbrella-eu-north-1",
    Key: "text.json",
  }).promise()
  const favText = JSON.parse(my_file.Body)?.favouriteText;

  res.json({
    status: "success",
    result: favText,
  });
});

router.get("/sum/:number1/:number2", async (req, res) => {
  let my_file = await s3.getObject({
    Bucket: "cyclic-fuzzy-bull-umbrella-eu-north-1",
    Key: "number.json",
  }).promise()
  const favNumber = JSON.parse(my_file.Body)?.favouriteNumber;
  const {number1, number2} = req.params;
  if(number1 == null || number2 == null) {
    res.status(400).send("Not provided numbers");
    return;
  }
  if(isNaN(parseInt(number1)) || isNaN(parseInt(number2))) {
    res.status(400).send("Numbers needs to be integer");
    return;
  }
  let result = add(parseInt(number1), parseInt(number2));
  if(favNumber != null) {
    result = add(result, favNumber )
  }
  res.json({
    status: "success",
    result: result,
  });
});

router.get("/favNumber", async(req,res) => {
  let my_file = await s3.getObject({
    Bucket: "cyclic-fuzzy-bull-umbrella-eu-north-1",
    Key: "number.json",
  }).promise()
  const favNumber = JSON.parse(my_file.Body)?.favouriteNumber;
  res.json({
    status: "success",
    result: favNumber,
  });
})

router.post("/favNumber", async (req, res) => {
  const {number} = req.body;
  if(number == null ) {
    res.status(400).send("Not provided number");
    return;
  } 
  if(isNaN(parseInt(number))) {
    res.status(400).send("The number needs to be integer");
    return;
  }

  await saveNum({favouriteNumber:number});
  res.json({
    status: "success",
    newFavouriteNumber: number,
  });
});




router.post("/favText", async (req, res) => {
  const {Content} = req.body;
  if(Content == null ) {
    res.status(400).send("Not provided text");
    return;
  } 
  await saveText({favouriteText:Content});
  res.json({
    status: "success",
    newFavouriteText: Content,
  });
});

router.delete("/favNumber", (req, res) => {
  favouriteNumber.favouriteNumber = 0; 
  save(favouriteNumber);
  res.json({
    status: "success"
  });
});

module.exports = router;