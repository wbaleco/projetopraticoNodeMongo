const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Pagamento = new Schema({
    nome: {
        type: String,
        required: true
    },
    valor: {
        type: Number,
        require: true
    },
    catpagamento: {
        type: Schema.Types.ObjectId,
        ref: "catpagamento",
        require: true
    },
    created: {
        type: Date,
        default: Date.now()
    }
});

mongoose.model("pagamento", Pagamento);