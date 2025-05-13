let express = require("express");
let fs = require("fs");
const app = express();
const { v4: uuidv4 } = require("uuid");
const path = require("path");
let filepath = path.join(__dirname, "todos.json");
app.use(express.json());

//json stringify ,,,, json.parse

app.get("/todos", (req, res) => {
  fs.readFile(filepath, "utf-8", function (err, data) {
    if (err) return res.status(500).send("Error Occurred");
    const todos = JSON.parse(data);
    res.status(200).json(todos);
  });
});

app.get("/todos/:id", function (req, res) {
  fs.readFile(filepath, "utf-8", function (err, data) {
    if (err) return res.status(500).send("Error Occurred");
    const todos = JSON.parse(data);
    let id = req.params.id;
    let todoToSend = todos.find((todo) => todo.id == id);
    if (!todoToSend) return res.status(404).send("Todo not found");
    res.json(todoToSend);
  });
});

app.post("/todos", (req, res) => {
  fs.readFile(filepath, "utf-8", function (err, data) {
    if (err) return res.status(500).send("Error Occurred");
    const todos = JSON.parse(data);
    const { title, description, completed } = req.body;
    if (!title || !description) {
      return res.status(400).send("Title and description are required");
    }
    const newTodo = {
      id: uuidv4(),
      title,
      description,
      completed: completed || false,
    };
    todos.push(newTodo);
    fs.writeFile(filepath, JSON.stringify(todos), "utf-8", () => {
      return res.status(201).json({ id: newTodo.id });
    });
  });
});

app.put("/todos/:id", (req, res) => {
  fs.readFile(filepath, "utf-8", function (err, data) {
    if (err) return res.status(500).send("Error Occurred");
    const todos = JSON.parse(data);
    const id = req.params.id;
    const { title, description, completed } = req.body;

    for (let i = 0; i < todos.length; i++) {
      if (todos[i].id === id) {
        if (title !== undefined) todos[i].title = title;
        if (description !== undefined) todos[i].description = description;
        if (completed !== undefined) todos[i].completed = completed;
        fs.writeFile(filepath, JSON.stringify(todos), "utf-8", () => {
          return res.status(200).send("Todo updated successfully");
        });
      }
    }
    return res.status(200);
  });
});

app.delete("/todos/:id", (req, res) => {
  fs.readFile(filepath, "utf-8", function (err, data) {
    if (err) return res.status(500).send("Error Occurred");
    let todos = JSON.parse(data);
    const id = req.params.id;
    const initialLength = todos.length;

    todos = todos.filter((todo) => todo.id !== id);

    if (todos.length === initialLength) {
      return res.status(404).send("Todo not found");
    }
    fs.writeFile(filepath, JSON.stringify(todos), "utf-8", () => {
      return res.status(200).send("Todo deleted successfully");
    });
  });
});

app.use((req, res) => {
  res.status(404).send("Route not found");
});

app.listen(3000, () => {
  console.log("Port is running");
});
