
var configData = null;
var devConfig = {
  lineUrl: "http://192.168.5.211:88/lines_backend.json",
  backendAPIUrl: "get data from line.json",
  staticUrl: ""
  // backendAPI: "http://192.168.5.211:8083/backend/"
};
var qcConfig = {
  lineUrl: "http://192.168.5.216:88/lines_backend.json",
  backendAPIUrl: "get data from line.json",
  staticUrl: ""
  // backendAPI: "http://192.168.5.216:8083/backend/"
};
var demositeConfig = {
  lineUrl: "https://sl.tiangeo.com/lines_backend.json",
  backendAPIUrl: "get data from line.json",
  staticUrl: ""
  // backendAPI: "https://ag.tiangeo.com/backend/"
};
var localConfig = {
  lineUrl: "http://192.168.5.228:88/lines_backend.json",
  backendAPIUrl: "get data from line.json",
  staticUrl: ""
  // backendAPI: "http://192.168.5.64:5052/backend/"
};

let stressConfig = {
  lineUrl: "https://sl.tiangeo888.com/lines_backend.json",
  backendAPIUrl: "get data from line.json",
  staticUrl: ""
};

let prodConfig = {
  lineUrl: "https://game.tjgame168.com/lines_backend.json",
  backendAPIUrl: "get data from line.json",
  staticUrl: ""
};

let stagingConfig = {
  // lineUrl: "https://game.tiangeo888.com/lines_backend.json",
  lineUrl: "https://game.tjgame888.com/lines_backend.json",
  backendAPIUrl: "get data from line.json",
  staticUrl: ""
};



if (process.env.NODE_ENV == "dev") {
  configData = devConfig;
}
if (process.env.NODE_ENV == "qc") {
  configData = qcConfig;
}
if (process.env.NODE_ENV == "demosite") {
  configData = demositeConfig;
}
if (process.env.NODE_ENV == "stress") {
  configData = stressConfig;
}
if (process.env.NODE_ENV == "local") {
  configData = localConfig;
}

if (process.env.NODE_ENV == "prod") {
  configData = prodConfig;
}

if (process.env.NODE_ENV == "staging") {
  configData = stagingConfig;
}

export { configData };
