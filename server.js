var express = require("express");
var fs = require("fs");
const { join } = require("path");
const { readdirSync, statSync } = require("fs");

var app = express();

app.use(express.urlencoded());
app.use(express.json());

app.get("/getEnvironment", (req, res) => {
  const getAllFiles = (dir, extn, files, result, regex) => {
    files = files || readdirSync(dir);
    result = result || [];
    regex = regex || new RegExp(`\\${extn}$`);

    for (let i = 0; i < files.length; i++) {
      let file = join(dir, files[i]);
      if (statSync(file).isDirectory()) {
        try {
          result = getAllFiles(file, extn, readdirSync(file), result, regex);
        } catch (error) {
          continue;
        }
      } else {
        if (regex.test(file)) {
          result.push(file);
        }
      }
    }
    return result;
  };

  const result = getAllFiles("C:\\Users\\NIKHIL DELL\\my-app\\Vieuth", ".env");
  // console.log(result);
  console.log(`Number of files found: ${result.length}`);

  process = [];
  for (var i = 0; i < result.length; i++) {
    process[i] = "Process " + (i + 1);
  }

  res.render("getEnvironment.ejs", {
    process: process,
    length: result.length,
  });
});

app.get("/getEnvironment/:process", (req, res) => {
  var path = "./P" + req.params.process[8] + "/.env";

  fs.readFile(path, function (err, data) {
    res.writeHead(200, { "Content-Type": "text/.env" });
    res.write(data);
    return res.end();
  });
});
app.get("/setEnvironment/:process", (req, res) => {
  var path = "./P" + req.params.process[8] + "/.env";
  var dotenv = require("dotenv").config({
    path: path,
  });
  var process =
    req.params.process.substring(0, 7) + " " + req.params.process[8];
  const result = dotenv.parsed;
  const entries = Object.entries(result);
  var length = entries.length;
  res.render("setEnvironment.ejs", {
    process: process,
    entries: entries,
    length: length,
  });
});

app.post("/setEnvironment/add/:process", (req, res) => {
  var process =
    req.params.process.substring(0, 7) + " " + req.params.process[8];
  var key = req.body.key;
  var value = req.body.value;
  res.redirect("/setEnvironment/" + process + "/" + key + "/" + value);
});

app.get("/setEnvironment/:process/:key/:value", (req, res) => {
  var path = "./P" + req.params.process[8] + "/.env";

  var text = req.params.key + "=" + req.params.value;
  fs.appendFileSync(path, text);
  fs.readFile(path, function (err, data) {
    res.writeHead(200, { "Content-Type": "text/.env" });
    res.write(data);
    return res.end();
  });
});

app.post("/setEnvironment/update/:process/:key/:value", (req, res) => {
  var path = "./P" + req.params.process[8] + "/.env";
  var dotenv = require("dotenv").config({
    path: path,
  });
  var process =
    req.params.process.substring(0, 7) + " " + req.params.process[8];
  const result = dotenv.parsed;
  const entries = Object.entries(result);
  var length = entries.length;
  for (var i = 0; i < length; i++) {
    if (entries[i][0] === req.params.key) {
      entries[i][1] = req.body.keyValue;
    }
  }
  fs.writeFile(path, "", function (err) {
    if (err) throw err;
  });

  for (var i = 0; i < length; i++) {
    var text = entries[i][0] + "=" + entries[i][1] + "\n";
    fs.appendFileSync(path, text);
  }

  fs.readFile(path, function (err, data) {
    res.writeHead(200, { "Content-Type": "text/.env" });
    res.write(data);
    return res.end();
  });
});

app.listen(3000);
