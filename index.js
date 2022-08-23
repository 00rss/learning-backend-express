// const express = require("express");
import express from "express";
import morgan from "morgan";
import cors from "cors";
import { requestLogger, unknownEndpoint } from "./utils/customMiddleware.js";
import { generateId } from "./utils/manageId.js";
import dotenv from "dotenv";
dotenv.config();
// import { notes } from "./utils/variables.js";

//let data just for learning
//should be replaced later with data form a database
let notes = [
  {
    id: 1,
    content: "HTML is easy",
    date: "2019-05-30T17:30:31.098Z",
    important: true,
  },
  {
    id: 2,
    content: "Browser can execute only Javascript",
    date: "2019-05-30T18:39:34.091Z",
    important: false,
  },
  {
    id: 3,
    content: "GET and POST are the most important methods of HTTP protocol",
    date: "2019-05-30T19:20:14.298Z",
    important: true,
  },
];

//custom morgan token
morgan.token("body", (req) => {
  return JSON.stringify(req.body);
});

//Inicializate app
const app = express();
app.use(cors());
//MIDDLEWARES
app.use(express.json());
app.use(requestLogger);
app.use(morgan(":method :url :status :response-time ms :body"));
// app.use(morgan("tiny"));

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
    // response.status(404).end();
    response.status(404).json(`the note: ${id} does not exits`);
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

//unknownEndpoint need to be at the end
//couse is the last route to match,
//also this middleware doens't have next() function
app.use(unknownEndpoint);

//STARTING THE SERVER ON A EXPLICIT PORT

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
