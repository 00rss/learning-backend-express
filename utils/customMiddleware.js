export const requestLogger = (request, response, next) => {
  console.log("Method:", request.method);
  console.log("Path:  ", request.path);
  console.log("Body:  ", request.body);
  console.log("---");
  next();
};
export const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};
