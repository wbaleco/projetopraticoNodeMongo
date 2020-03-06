const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');
const Schema = mongoose.Schema;

const Usuario = new Schema({
    nome: {
        type: String,
        required: true
    },
    email: {
        type: String,
        require: true
    },
    senha: {
        type: String,
        require: true
    },
    created: {
        type: Date,
        default: Date.now()
    }
});

Usuario.plugin(mongoosePaginate);

mongoose.model("usuario", Usuario);