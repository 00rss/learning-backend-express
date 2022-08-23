// const express = require("express");
import express from "express";
import { requestLogger } from "./utils/customMiddleware.js";
import { generateId } from "./utils/manageId.js";
import { notes } from "./utils/variables.js";

//Inicializate app
const app = express();

//MIDDLEWARES
app.use(requestLogger);

//root route

app.get("/", (request, response) => {
  response.send("<h1>Hello World!</h1>");
});

//MANAGE INDIVIVUAL NOTES
app.get("/api/notes/:id", (request, response) => {
  const id = Number(request.params.id);
  const note = notes.find((note) => note.id === id);

  if (note) {
    response.json(note);
  } else {
    response.status(404).end();
  }
});
app.delete("/api/notes/:id", (request, response) => {
  const id = Number(request.params.id);
  notes = notes.filter((note) => note.id !== id);

  response.status(204).end();
});

//MANAGE ALL NOTES

app.get("/api/notes", (request, response) => {
  response.json(notes);
});
app.post("/api/notes", (request, response) => {
  const body = request.body;

  if (!body.content) {
    return response.status(400).json({
      error: "content missing",
    });
  }

  const note = {
    content: body.content,
    important: body.important || false,
    date: new Date(),
    id: generateId(notes),
  };

  notes = notes.concat(note);

  response.json(note);
});

//STARTING THE SERVER ON A EXPLICIT PORT

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
