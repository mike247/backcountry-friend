const lngLatToWorld = require("@math.gl/web-mercator").lngLatToWorld;

console.log(
  [
    lngLatToWorld([172.3442459110000016, -42.3051182000000026]),
    lngLatToWorld([172.9363060000000019, -41.7952482070000002]),
  ].flat()
);
