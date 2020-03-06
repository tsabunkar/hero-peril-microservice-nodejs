const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const request = require('request');
const { threats } = require('./constant.threat');

const port = process.argv.slice(2)[0];
const app = express();

app.use(bodyParser.json());

const heroesService = 'http://localhost:8001';

// http://localhost:8002/threats
app.get('/threats', (req, res) => {
  console.log('Returning threats list');
  res.send(threats);
});

// http://localhost:8002/assignment
app.post('/assignment', (req, res) => {
  request.post(
    {
      headers: { 'content-type': 'application/json' },
      url: `${heroesService}/hero/${req.body.heroId}`,
      body: `{
        "busy": true
      }`
    },
    (err, heroResponse, body) => {
      if (!err) {
        const threatId = parseInt(req.body.threatId);
        const threat = threats.find(subject => subject.id === threatId);
        threat.assignedHero = req.body.heroId;
        res.status(202).send(threat);
      } else {
        res
          .status(400)
          .send({ problem: `Hero Service responded with issue ${err}` });
      }
    }
  );
});

// app.use('/img', express.static(path.join(__dirname, 'img')));
console.log(`Threats service listening on port ${port}`);
app.listen(port);
