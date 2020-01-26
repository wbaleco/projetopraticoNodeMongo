//Carregar módulos
const express = require('express');
const app = express();

const bodyparser = require('body-parser');
const handlebars = require('express-handlebars');
const mongoose = require('mongoose');

//Configurações
//body-parser
app.use(bodyparser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyparser.json());

//Handlebars
app.engine('handlebars', handlebars({ defaultLayout: "main" }));
app.set('view engine', 'handlebars');




//Iniciar servidor
app.listen(3000, () => {
    console.log(`Server started on port`);
});