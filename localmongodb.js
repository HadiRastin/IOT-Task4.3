const mongoose = require("mongoose");
var plotly = require("plotly")("hadirastin88", "4RXSGeDDgLgLdoknDVdU");
const Sensor = require("./models/sensor");

var data = {
  x: [],
  y: [],
  type: "scatter",
  name: "Local",
};

setInterval(sensortest, 10000); //time is in ms

function sensortest() {
  const sensordata = {
    id: 0,
    name: "temperaturesensor",
    address: "221 Burwood Hwy, Burwood VIC 3125",
    time: Date.now(),
    temperature: 20,
  };

  const low = 10;
  const high = 40;
  reading = Math.floor(Math.random() * (high - low) + low);
  sensordata.temperature = reading;
  const jsonString = JSON.stringify(sensordata);
  console.log(jsonString);

  const newSensor = new Sensor({
    id: sensordata.id,
    name: sensordata.name,
    address: sensordata.address,
    time: sensordata.time,
    temperature: sensordata.temperature,
  });

  mongoose.connect("mongodb://0.0.0.0:27017/SIT314").then(() =>
    newSensor
      .save()
      .then((doc) => {
        console.log(doc);
      })
      .then(() => {
        data.x.push(new Date().toISOString());
        data.y.push(newSensor.time);
        var graphOptions = {
          filename: "iot-performance",
          fileopt: "overwrite",
        };
        plotly.plot(data, graphOptions, function (err, msg) {
          if (err) return console.log(err);
          console.log(msg);
        });
      })
      .then(() => {
        console.log(
          "The time it takes to store the sensor data in the database is: ",
          Date.now() - newSensor.time
        );
        mongoose.connection.close();
      })
  );
}
