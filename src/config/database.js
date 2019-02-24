const mongoose = require('mongoose');

const MONGODB = ('mongodb://127.0.0.1/mymoney');
mongoose.Promise = global.Promise;

module.exports = mongoose.connect(MONGODB);

mongoose.Error.messages.general.required = "O atributo '{PATH}' é obrigatório.";
