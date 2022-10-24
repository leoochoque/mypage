// const repl = require('repl');
// repl.start('> ');

const data = {
    "persons": [
      {
        "name": "Arto Hellas",
        "number": "040-123456",
        "id": 1
      },
      {
        "name": "Ada Lovelace",
        "number": "39-44-5323523",
        "id": 2
      },
      {
        "name": "Dan Abramov",
        "number": "12-43-234345",
        "id": 3
      },
      {
        "name": "Mary Poppendieck",
        "number": "39-23-6423122",
        "id": 4
      },
      {
        "name": "Leo Messi",
        "number": "23-43434332-23",
        "id": 7
      }
    ]
  }

const express = require('express');
const app = express();
const morgan = require('morgan');

const getId = () => data.persons.length > 0 ? Math.max(...data.persons.map( person => person.id )) + 1 : 0;
morgan.token('data', (req, res) => {
    return JSON.stringify(req.body);
})

app.use(express.json());
app.use(morgan(':method :url :status :response-time ms :data'))


// GET Requests

app.get('api/persons', (req, res) => {
    res.json(data);
})

app.get('api/persons/:id', (req, res) => {
    const id = req.params.id;
    const person = data.persons.find( note => note.id === parseInt(id));
    if(person) res.json(person);
    else res.status(400).json({error: 'Persona no encontrada'})
})

app.get('api/info', (req, res) => {
    res.send(`Phonebook has ${data.persons.length} numbers registred
    ${new Date()}`)
})

// POST Requests

app.use('api/persons', (req,  res, next) => {
    const {name, number} = req.body;

    if(!!name && !!number){ 
    const exist = data.persons.filter( person => person.name === name);

    if(exist.length === 0){
      return next('route')
    }
    
    res.status(400).json({error: 'La persona ya se encuentra agregada en el sistema'})

    }
    else res.status(400).json({ error: 'El campo nombre o telefono estan vacios o no existen' });
});

app.post('api/persons', (req, res) => {
    const id = getId();
    const person = {
        name: req.body.name,
        phone: req.body.number,
        id,
    }
    data.persons = data.persons.concat(person);
    res.status(201).json(person);
})

// DELETE Requests

app.delete('api/persons/:id', (req, res) => {
    const id = req.params.id;
    data.persons = data.persons.filter( person => person.id !== parseInt(id));
    res.status(204).end();
})

// HANDLE ALL REQUESTS

app.use((req,res) =>{
    res.status(400).json({error: 'Se realizo una solicitud invalida'})
})

app.listen(3000, () => {
    console.log('Server running! Port 3000');
})

module.exports = app;