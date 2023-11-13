const readXlsxFile = require('read-excel-file/node')
const axios = require("axios").default;

const express = require('express');
const app = express();
const PORT = 3914;

app.use(express.json());

app.listen(
  PORT,
  () => console.log(`Server running at http://localhost:${PORT}`)
);

app.post('/readXlsx', (req, res) => {
  if (!req.body.clientSystem || !req.body.queueId || !req.body.apiKey || !req.body.fileId) {
    res.status(422).send({"error":"Missign data"});
  }else{
    const JSONData = {
      "queueId": req.body.queueId,
      "apiKey": `${req.body.apiKey}`,
      "fileId": req.body.fileId,
      "download": true
    };
    
    axios(`${req.body.clientSystem}/int/downloadFile`, {
      responseType: 'arraybuffer',
      method: "POST",
      data: JSONData,
    })
    .then(response => {
      return readXlsxFile(response.data);
    })
    .then((rows) => {
      res.status(200).send(rows)
    })
    .catch((error) => {
      res.status(500).send(error);
    });
  };
});