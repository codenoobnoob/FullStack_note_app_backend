const mongoose = require("mongoose");

if (process.argv.length < 3) {
  console.log("give password as argument");
  process.exit(1);
}

const password = process.argv[2];
const content = process.argv[3];
const importance = process.argv[4];

const url = `mongodb+srv://fullstack:${password}@learningprojects.ltdez.mongodb.net/note-app?retryWrites=true&w=majority`;

mongoose.connect(url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true,
});

const noteSchema = new mongoose.Schema({
  content: String,
  date: Date,
  important: Boolean,
});
const Note = mongoose.model("Note", noteSchema);

const note = new Note({
  content: content,
  date: new Date(),
  important: !!importance ? true : false,
});

// note.save().then((response) => {
//   console.log(`added note: "${content}" to db`);
//   mongoose.connection.close();
// });

Note.find({}).then((result) => {
  result.forEach((note) => {
    console.log(note);
  });
  mongoose.connection.close();
});
