const express = require('express');
const cors = require('cors');

 const { v4: uuidv4 } = require('uuid');

const app = express();

app.use(cors());
app.use(express.json());

 const users = [];;

function checksExistsUserAccount(request, response, next) {
const {username} = request.headers
if(!username) {
  return response.status(404).json({error:'Header not found'});
}
request.body.username = username
next()
}

app.post('/users', (request, response) => {
    const {name, username} = request.body
    const id =  uuidv4()
  if(!users.findIndex(user => user.username === username)){
    return  response.status(400).json({  
   error: 'User already exists'
  })
  }
  users.push({
    id,
    name,
    username,
    todos: []
  }) 
 return response.status(201).json({  
    id,
    name,
    username,
    todos: []
  })
});

app.get('/todos', checksExistsUserAccount, (request, response) => {
  const {username} = request.body
  const user = users.find(user => user.username === username)
  if(!user){
    return response.status(404).json({error: 'User not found'})
  }
  return response.status(200).json(user.todos)

});

app.post('/todos', checksExistsUserAccount, (request, response) => {
  const {username} = request.body
  const user = users.find(user => user.username === username)
  if(!user){
    return response.status(404).json({error: 'User not found'})
  }
  const{title, deadline} = request.body
  const id  =  uuidv4()
  const todo = {
  id,
	title,
	done: false, 
	deadline: new Date(deadline), 
	created_at:  new Date()
  }
  user.todos.push(todo)
  return response.status(201).json(todo)
});

app.put('/todos/:id', checksExistsUserAccount, (request, response) => {
  const {username,title, deadline} = request.body

  const {id}  =  request.params
  if(!id) {
    return response.status(404).json({error: 'ID not found'})
  }
  const user = users.find(user => user.username === username)
  if(!user){
    return response.status(404).json({error: 'User not found'})
  }
    const todo = user.todos.findIndex(todo => todo.id === id)
  if(todo===-1)
  {
   return response.status(404).json({error: "Not Found"})
  }
  user.todos[todo].title= title
  user.todos[todo].deadline= deadline
  return response.status(201).json(user.todos[todo])
});

app.patch('/todos/:id/done', checksExistsUserAccount, (request, response) => {
  const {username } = request.body

  const {id}  =  request.params
  if(!id) {
    return response.status(404).json({error: 'ID not found'})
  }
  const user = users.find(user => user.username === username)
  if(!user){
    return response.status(404).json({error: 'User not found'})
  }
    const todo = user.todos.findIndex(todo => todo.id === id)
  if(todo===-1)
  {
   return response.status(404).json({error: "Not Found"})
  }
  user.todos[todo].done= true
  return response.status(201).json(user.todos[todo])
});

app.delete('/todos/:id', checksExistsUserAccount, (request, response) => {
    const {username } = request.body
  const {id}  =  request.params
  if(!id) {
    return response.status(404).json({error: 'ID not found'})
  }
  const user = users.find(user => user.username === username)
  if(!user){
    return response.status(404).json({error: 'User not found'})
  }
    const todo = user.todos.findIndex(todo => todo.id === id)
  if(todo===-1)
  {
   return response.status(404).json({error: "Not Found"})
  }
  user.todos.splice(todo,1)
  return response.status(204).json(user.todos[todo])
});

module.exports = app;