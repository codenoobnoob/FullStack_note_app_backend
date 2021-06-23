require("dotenv").config();
const express = require("express");
const cors = require("cors");
const Note = require("./models/note");
const { response } = require("express");
const app = express();
app.use(express.json());
app.use(cors());
app.use(express.static("build"));

const requestLogger = (request, response, next) => {
  console.log("Method: ", request.method);
  console.log("Path: ", request.path);
  console.log("Body: ", request.body);
  console.log("----");
  next();
};
app.use(requestLogger);

app.get("/api/notes/:id", (request, response) => {
  Note.findById(request.params.id)
    .then((note) => {
      response.json(note);
    })
    .catch((error) => {
      console.log(`error getting file ${request.params.id}:`, error.message);
    });
});

app.delete("/api/notes/:id", (request, response) => {
  console.log(request.params.id);
  Note.findByIdAndDelete(request.params.id)
    .then((note) => {
      console.log(note);
      response.status(204).end();
    })
    .catch((error) => {
      console.log(`error deleting file ${request.params.id}:`, error.message);
    });
});

app.post("/api/notes", (request, response) => {
  const body = request.body;
  if (!body.content) {
    return res.status(400).json({ error: "content missing" });
  }
  const note = new Note({
    content: body.content,
    important: body.important || false,
    date: new Date(),
  });

  note
    .save()
    .then((savedNote) => {
      response.json(savedNote);
    })
    .catch((error) => {
      console.log(`error saving file ${body.content}:`, error.message);
    });
});

app.get("/api/notes", (request, response) => {
  Note.find({}).then((notes) => {
    response.json(notes);
  });
});

app.put("/api/notes/:id", (request, response) => {
  const id = request.params.id;
  const newNote = request.body;
  Note.findByIdAndUpdate(
    id,
    { important: newNote.important },
    { new: true },
    (error, res) => {
      if (error) {
        console.log(error);
      } else {
        console.log("Updated note: ", res);
      }
    }
  ).then((note) => {
    response.json(note);
  });
});

const port = process.env.PORT;
app.listen(port, () => {
  console.log(`server running on port ${port}`);
});
