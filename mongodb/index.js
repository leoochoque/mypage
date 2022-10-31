const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://admin:leoochoque1@cluster0.swgwkoq.mongodb.net/Main?retryWrites=true&w=majority')
  .then(() => console.log('Succesfully connected to DB!'))
  .catch(e => console.log('Error: ', e));

const personSchema = new mongoose.Schema({
  name: String,
  number: {
    type: String,
    minlength: 5,
    required: true,
  },
});

personSchema.set('toJSON', {
  transform: (doc, ret) => {
    ret.id = ret._id.toString();
    delete ret._id;
    delete ret.__v;
    return ret;
  }
});

const Person = mongoose.model('Person', personSchema);

const getData = async () => {
  return await Person.find({});
};

const getDataById = async (id) => {
  try {
    return await Person.findById(id);
  } catch (e) {
    return handleErrors(e);
  }
};

const addPerson = async (person) => {
  const newPerson = new Person({
    name: person.name,
    number: person.number,
  });
  try {
    return await newPerson.save();
  } catch (e) {
    return handleErrors(e);
  }
};

const deletePerson = async (id) => {
  try {
    await Person.findByIdAndRemove(id);
  } catch (e) {
    return handleErrors(e);
  }
};

const updatePerson = async (id, person) => {
  const { number } = person;
  try {
    // if(!!number){
    await Person.findByIdAndUpdate(id, {
      number: number,
    }, { runValidators: true });
    // }else{
    //     console.log('Fallo la promesa')
    //     throw {name: "MissingNumberField"};
    // }
  } catch (e) {
    return handleErrors(e);
  }
};

const handleErrors = (error) => {
  const msgToUser = {};

  if (error.name === 'CastError') {
    console.log('error db: malformatted id');
    msgToUser.name = error.name;
    //Personalize message
    msgToUser.error = 'Request id format was incorrect, you must use a valid id';
  }

  // if(error.name == 'MissingNumberField'){
  //     console.log('error db: number field dont exist');
  //     msgToUser.error = 'number field dont exist';
  // }

  if (error.name == 'ValidationError') {
    console.log('error db: number field too short, or not create');
    msgToUser.name = error.name;
    msgToUser.type = error.errors.number.kind;
    msgToUser.error = error.message;
  }

  return Promise.reject(msgToUser);
};
// deletePerson('63573c6d1cb4a37688edbf16').then(r => console.log('r',r));
// updatePerson('63573cfdddd47ed727f6f6ce', {}).then( res => console.log(res));
// getData().then(r=>console.log(r));

module.exports = { getData, getDataById, addPerson, deletePerson, updatePerson };
