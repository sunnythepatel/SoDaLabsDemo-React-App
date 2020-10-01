const AWS = require("aws-sdk"),
  { Readable } = require("readable-stream");
const { response } = require("express");

var Promise = require("promise");

const express = require("express");
const app = express();
const router = express.Router();
const CSV = require("csv-string");
const path = require("path");
const bodyParser = require("body-parser");
const API_PORT = process.env.PORT || 5000;

const s3 = new AWS.S3({
  region: "ap-southeast-2",
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/api/hello", (req, res) => {
  res.send({ express: "Hello From Express" });
});

app.post("/api/test", (req, res) => {
  console.log(req.body);
  s3SelectQuery = (query) => {
    return new Promise((resolve, reject) => {
      var params = {
        Bucket: "sodalabsdemo",
        Key: "daily-min-temperatures.csv",
        Expression: query,
        ExpressionType: "SQL",
        InputSerialization: {
          CSV: {
            FieldDelimiter: ",",
            FileHeaderInfo: "USE",
            RecordDelimiter: "\n",
          },
          CompressionType: "NONE",
        },

        OutputSerialization: {
          CSV: {
            FieldDelimiter: ",",
            RecordDelimiter: "\n",
          },
        },
      };

      let resultData = "";
      s3.selectObjectContent(params, function (err, data) {
        if (!err) {
          data.Payload.on("data", (data) => {
            if (data.Records && data.Records.Payload) {
              let str = Buffer.from(data.Records.Payload);
              // Json Format conversion
              //   let json = JSON.stringify(str);
              //   let bufferOriginal = Buffer.from(JSON.parse(json).data);
              //   console.log(bufferOriginal.toString("utf8"));
              resultData += str;
            }
          });
          data.Payload.on("end", (data) => {
            const parsedCsv = CSV.parse(resultData);
            resolve(parsedCsv);
          });
        } else {
          reject(err);
        }
      });
    });
  };
  s3SelectQuery(
    `select * from s3object s where s.Dated BETWEEN '${req.body.startdate}' AND '${req.body.enddate}' ;`
  ).then((data) => {
    //res.json({ success: true, data });
    res.send({ data });
  });
});

app.listen(API_PORT, () => console.log(`LISTENING ON PORT ${API_PORT}`));

// Use it for production
if (process.env.NODE_ENV === "production") {
  // Serve any static files
  app.use(express.static(path.join(__dirname, "client/build")));

  // Handle React routing, return all requests to React app
  app.get("*", function (req, res) {
    res.sendFile(path.join(__dirname, "client/build", "index.html"));
  });
}
//"select * from s3object s where s.Dated BETWEEN '1981-01-06' AND '1981-01-08' ;";
