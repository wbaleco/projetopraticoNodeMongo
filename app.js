//Carregando os módulos
const express = require('express');
const handlebars = require('express-handlebars');
const bodyParser = require('body-parser');
const app = express();
const admin = require("./routes/admin");
const path = require('path');
const mongoose = require('mongoose');
const session = require('express-session');
const flash = require('connect-flash');

//Configurações 
//Sessão
app.use(session({
    secret: 'celkeonesession',
    resave: true,
    saveUninitialized: true
}));
//Flash
app.use(flash());

//Middleware
app.use((req, res, next) => {
    res.locals.success_msg = req.flash("success_msg");
    res.locals.error_msg = req.flash("error_msg");
    next();
});

//Body Parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//Handlebars
app.engine('handlebars', handlebars({ defaultLayout: "main" }))
app.set("view engine", 'handlebars');

//Mongoose - conexão com db
mongoose.connect('mongodb://localhost/gerenciadorfinanceiro', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log("Conexão realizada com sucesso");
}).catch((err) => {
    console.log("Erro ao tentar conectar " + err);
});


//Arquivos estáticos
app.use(express.static(path.join(__dirname, "public")));

//Rotas
app.use('/', admin);


//Iniciar servidor
app.listen(3000, () => {
    console.log(`Server started on port`);
});