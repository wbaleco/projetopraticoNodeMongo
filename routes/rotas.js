const express = require('express');
const app = express();

const router = express.Router();

//Rotas

router.get('/', (req, res) => {
    //res.send("Página inicial");
    res.render("admin/index");

});
router.get('/listar-pagamentos', (req, res) => {
    res.send("Lista de pagamentos");
});

//Exportar módulo

module.exports = router;