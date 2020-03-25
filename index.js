#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
// const styles = require("./styles.js");

if (process.argv.length < 3) {
  console.error("Component name should be provided");
  process.exit(1);
}

const componentPath = process.argv[process.argv.length - 1];
const conponentParts = componentPath.split("/");
const componentName = conponentParts.pop();
const parentDir = path.join(process.cwd(), ...conponentParts);
const dir = path.join(process.cwd(), ...conponentParts, componentName);

if (!fs.existsSync(parentDir)) {
  console.error("Sorry, parent directory ", parentDir, "doesn't exist. Exiting...");
  process.exit(1);
} else if (fs.existsSync(dir)) {
  console.error("Sorry, component", dir, "already exists. Exiting...");
  process.exit(1);
} else {
  fs.mkdirSync(dir);
}

function writeToFile(name, getData = () => "") {
  const pathToFile = path.join(dir, name);
  const componentName = path.basename(dir);
  fs.writeFile(path.join(dir, name), getData(componentName), { encoding: "utf8" }, err => {
    if (err) {
      console.error("Error writing file!", err);
      process.exit(1);
    } else {
      console.log("Creating", pathToFile);
    }
  });
}

const toLower = str => `${str.charAt(0).toLowerCase()}${str.slice(1)}`;

writeToFile("operations.gql");
writeToFile("index.js", componentName => {
  return `import React from 'react';
import styes from './styles';
const ${componentName} = () => (
  <div className={styes.${toLower(componentName)}}>👋</div>
);
export default ${componentName};`;
});
writeToFile("styles.module.scss", componentName => {
  return `.${toLower(componentName)} {

}`;
});
