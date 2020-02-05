//Carregando os módulo
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
require("../models/CatPagamento");
const CatPagamento = mongoose.model('catpagamento');

router.get('/', (req, res) => {
    //res.send("Página incial do administrativo");
    res.render('admin/index');
});

router.get('/pagamentos', (req, res) => {
    res.render('admin/pagamentos');
});

router.get('/cat-pagamento', (req, res) => {
    CatPagamento.find().then((catpagamento) => {
        res.render('admin/cat-pagamento', { catpagamentos: catpagamento });
    }).catch((erro) => {
        req.flash("error_msg", "Erro: categoria de pagamento não encontrada!");
        res.redirect('admin/cat-pagamento');

    });

});
router.get('/cad-cat-pagamento', (req, res) => {
    res.render('admin/cad-cat-pagamento');
});

router.post('/add-cat-pagamento', (req, res) => {
    var errors = []
    if (errors.length > 0 || !req.body.nome || typeof req.body.nome == undefined || req.body.nome == null) {
        errors.push({ error: "Necessário preencher o campo nome!" });
        res.render("admin/cad-cat-pagamento", { errors: errors });

    } else {
        const addCatPagamento = {
            nome: req.body.nome
        };
        new CatPagamento(addCatPagamento).save().then(() => {
            req.flash("success_msg", "Categoria de pagamento cadastrado com sucesso!")
            res.redirect('/cat-pagamento');
        }).catch((erro) => {
            req.flash("error_msg", "Error: Categoria de pagamento não foi  cadastrada com sucesso!")
        });
    }
});

router.get('/edit-cat-pagamento/:id', (req, res) => {

    CatPagamento.findOne({ _id: req.params.id }).then((catpagamento) => {
        res.render('admin/edit-cat-pagamento', { catpagamento: catpagamento });
    }).catch((erro) => {
        req.flash("error_msg", "Error: Categoria de pagamento não foi editada com sucesso!")
        res.redirect('/cat-pagamento');
    });
});

router.post('/update-cat-pagamento', (req, res) => {
    CatPagamento.findOne({ _id: req.body.id }).then((catpagamento) => {
        catpagamento.nome = req.body.nome
        catpagamento.save().then(() => {
            req.flash("success_msg", "Categoria de pagamento editada com sucesso!")
            res.redirect("/cat-pagamento");
        }).catch((erro) => {
            req.flash("error_msg", "Error: Categoria de pagamento não foi editada com sucesso!")
            res.redirect("/cat-pagamento");
        });
    }).catch((erro) => {
        req.flash("error_msg", "Error: Categoria de pagamento não encontrado!")
        res.redirect("/cat-pagamento");
    });
});

router.get('/del-cat-pagamento/:id', (req, res) => {

    CatPagamento.deleteOne({ _id: req.params.id }).then(() => {
        req.flash("success_msg", "Categoria de pagamento deletada com sucesso!")
        res.redirect("/cat-pagamento");

    }).catch((erro) => {
        req.flash("error_msg", "Error: Categoria de pagamento não foi deletada!")
        res.redirect("/cat-pagamento");
    });

});

//Exportar o módulo de rotas
module.exports = router;