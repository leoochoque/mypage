const app = require('express')();
const mongoose = require('mongoose');

main().catch(e => console.log(e));

async function main() {
    await mongoose.connect('mongodb+srv://admin:leoochoque1@cluster0.swgwkoq.mongodb.net/Main?retryWrites=true&w=majority');
    console.log('Connected')
}

const personSchema = new mongoose.Schema({
    name: 'String',
    number: 'String'
})

personSchema.set('toJSON', {
    transform: (document, schema) => {
        schema.id = schema._id.toString();
        delete schema._id
        delete schema.__v
    }
})

const Person = mongoose.model('Person', personSchema);

// const myPerson = new Person({
//     name: 'Pepe',
//     number: '212-2121-01'
// })

// myPerson.save().then( result => {console.log(result); mongoose.connection.close()});

async function getDataFromDb(){
    const data = await Person.find({});
    return data;
}

async function getOnePerson(id){
    const data = await Person.findById(id);
    return data;
}

app.get('/', (req, res) => {
    const getData = async() => {
        const data = await getDataFromDb();
        res.json(data);
    }
    getData();
})

app.get('/:id', (req, res) => {
    const id = req.params.id;
    const getData = async() => {
        const data = await getOnePerson(id);
        res.json(data);
    }
    getData();
})

app.listen(3000, () => {
    console.log('Server on! port 3000')
})