const fs = require("fs");

const image = fs.readFileSync("../public/masks/nelson.png");
const base64 = image.toString("base64");
console.log(`data:image/png;base64,${base64}`);
