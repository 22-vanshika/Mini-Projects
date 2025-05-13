let express = require ("express");
let fs = require ("fs");
const app = express();
const { v4: uuidv4 } = require('uuid');

let todos = [];
// [{
//     id:"igdfzv" ,
//     title:" gdfds",
//     description :" rgdfvdffse"
// }]

app.use(express.json());

app.get('/todos', (req, res) => {
    if (todos.length === 0) return res.send("Nothing to do :(");
    res.json(todos);
});


app.get('/todos/:id',function(req,res){
    let id=req.params.id;
    let todoToSend = todos.find(todo => todo.id == id);
    if (!todoToSend) return res.status(404).send("Todo not found");
    res.json(todoToSend);
})

app.post('/todos', (req, res) => {
    const { title, description, completed } = req.body;
    if (!title || !description) {
        return res.status(400).send("Title and description are required");
    }
    const newTodo = { id: uuidv4(), title, description, completed: completed || false };
    todos.push(newTodo);
    res.status(201).json({ id: newTodo.id });
});

app.put('/todos/:id', (req, res) => {
  const id = req.params.id; 
  const { title, description, completed } = req.body;

  for (let i = 0; i < todos.length; i++) {
    if (todos[i].id === id) {
      if (title !== undefined) todos[i].title = title;
      if (description !== undefined) todos[i].description = description;
      if (completed !== undefined) todos[i].completed = completed;
      return res.status(200).send("Todo updated successfully");
    }
  }
  return res.status(404).send("Todo not found");
});

app.delete('/todos/:id', (req, res) => {
  const id = req.params.id;
  const initialLength = todos.length;

  todos = todos.filter(todo => todo.id !== id);

  if (todos.length === initialLength) {
    return res.status(404).send("Todo not found");
  }

  return res.status(200).send("Todo deleted successfully");
});

app.use((req, res) => {
  res.status(404).send("Route not found");
});

app.listen(3000,()=>{
    console.log("Port is running")
})