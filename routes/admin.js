//Carregando os módulo
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcryptjs = require('bcryptjs');
require("../models/CatPagamento");
const CatPagamento = mongoose.model('catpagamento');
require('../models/Pagamento');
const Pagamento = mongoose.model('pagamento');
require('../models/Usuario');
const Usuario = mongoose.model('usuario');

//Página inicial
router.get('/', (req, res) => {
    //res.send("Página incial do administrativo");
    res.render('admin/index');
});

//LISTAR USUÁRIOS
router.get('/usuarios', (req, res) => {

    Usuario.find().then((usuario) => {
        res.render('admin/usuarios', { usuarios: usuario });
    }).catch((erro) => {
        req.flash("error_msg", "Erro: Usuários não encontrados!");
        res.redirect('/usuarios');

    })


});

//CADASTRAR USUÁRIO
router.get('/cad-usuario', (req, res) => {
    res.render('admin/cad-usuario');

});

router.post('/add-usuario', (req, res) => {
    var errors = []
    if (!req.body.nome || typeof req.body.nome == undefined || req.body.nome == null) {
        errors.push({ error: "Erro: Necessário preencher o campo nome!" })
    }
    if (!req.body.email || typeof req.body.email == undefined || req.body.email == null) {
        errors.push({ error: "Erro: Necessário preencher o campo e-mail!" })
    }
    if (!req.body.senha || typeof req.body.senha == undefined || req.body.senha == null) {
        errors.push({ error: "Erro: Necessário preencher o campo senha!" })
    }
    if (!req.body.rep_senha || typeof req.body.rep_senha == undefined || req.body.rep_senha == null) {
        errors.push({ error: "Erro: Necessário preencher o campo repetir senha!" })
    }
    if (req.body.senha != req.body.rep_senha) {
        errors.push({ error: "Erro: As senhas são diferentes!" })
    }
    if (req.body.senha.length < 6) {
        errors.push({ error: "Erro: Senha muito fraca!" })
    }

    if (errors.length > 0) {
        res.render("admin/cad-usuario", { errors: errors })
    } else {

        Usuario.findOne({ email: req.body.email }).then((usuario) => {

            if (usuario) {
                req.flash("error_msg", "Erro: Este email já está sendo utilizado!");
                res.redirect('/cad-usuario');
            } else {

                const addUsuario = new Usuario({
                    nome: req.body.nome,
                    email: req.body.email,
                    senha: req.body.senha
                });
                bcryptjs.genSalt(10, (erro, salt) => {
                    bcryptjs.hash(addUsuario.senha, salt, (erro, hash) => {
                        if (erro) {
                            req.flash("error_msg", "Erro: Não foi possível cadastrar!");
                            res.redirect('/cad-usuarios');

                        } else {
                            addUsuario.senha = hash;
                            addUsuario.save().then(() => {
                                req.flash("success_msg", "Usuário cadastrado com sucesso!")
                                res.redirect("/usuarios");

                            }).catch((erro) => {
                                req.flash("error_msg", "Erro: Não foi possível cadastrar!");
                                res.redirect('/cad-usuarios');

                            });
                        }
                    });
                });

            }

        }).catch((erro) => {

            req.flash("error_msg", "Erro: Não foi possível cadastrar o usuário!");
            res.redirect('/usuarios');

        });

    }

});

router.get('/pagamentos', (req, res) => {
    Pagamento.find().populate("catpagamento").then((pagamentos) => {
        res.render('admin/pagamentos', { pagamentos: pagamentos });

    }).catch((erro) => {
        req.flash("error_msg", "Erro: categoria de pagamentos não encontrados!");
        res.redirect('/pagamentos');
    });


});

router.get('/visu-pagamento/:id', (req, res) => {
    Pagamento.findOne({ _id: req.params.id }).populate('catpagamento').then((pagamento) => {
        res.render('admin/vis-pagamento', { pagamento: pagamento });
    }).catch((erro) => {
        req.flash("error_msg", "Erro: Pagamento não encontrados!");
        res.redirect('/pagamentos');

    })

});

router.get('/edit-pagamento/:id', (req, res) => {
    Pagamento.findOne({ _id: req.params.id }).populate("catpagamento").then((pagamento) => {
        CatPagamento.find().then((catpagamentos) => {
            res.render("admin/edit-pagamento", { pagamento: pagamento, catpagamentos: catpagamentos })
        }).catch((erro) => {
            req.flash("error_msg", "Error: Não foi possível carregar as categorias de pagamentos!")
            res.redirect('/pagamentos');
        });

    }).catch((erro) => {
        req.flash("error_msg", "Error: Não é possível carregar o formulário editar pagamento!")
        res.redirect('/pagamentos');
    });
});
router.post('/update-pagamento', (req, res) => {
    Pagamento.findOne({ _id: req.body.id }).then((pagamento) => {
        pagamento.nome = req.body.nome,
            pagamento.valor = req.body.valor;
        pagamento.catpagamento = req.body.catpagamento
        pagamento.save().then(() => {
            req.flash("success_msg", "Pagamento editada com sucesso!")
            res.redirect("/pagamentos");
        }).catch((erro) => {
            req.flash("error_msg", "Error: Categoria de pagamento não foi editada com sucesso!")
            res.redirect("/pagamentos");
        });
    }).catch((erro) => {
        req.flash("error_msg", "Error: Categoria de pagamento não encontrado!")
        res.redirect("/pagamentos");
    });
});

router.get('/cad-pagamento', (req, res) => {
    CatPagamento.find().then((catpagamento) => {
        res.render('admin/cad-pagamento', { catpagamentos: catpagamento });
    }).catch((erro) => {
        req.flash("error_msg", "Erro: categoria de pagamento não encontrada!");
        res.redirect('admin/pagamentos');
    });
});


router.post('/add-pagamento', (req, res) => {
    var errors = [];
    if (!req.body.nome || typeof req.body.nome == undefined || req.body.nome == null) {
        errors.push({ error: "Necessário preencher o campo nome" });
    }
    if (!req.body.valor || typeof req.body.valor == undefined || req.body.valor == null) {
        errors.push({ error: "Necessário preencher o campo valor" });
    }
    if (!req.body.catpagamento || typeof req.body.catpagamento == undefined || req.body.catpagamento == null) {
        errors.push({ error: "Necessário preencher o campo categoria de pagamento" });
    }

    if (errors.length > 0) {
        res.render("admin/cad-pagamento", { errors: errors });
    } else {
        const addPagamento = {
            nome: req.body.nome,
            valor: req.body.valor,
            catpagamento: req.body.catpagamento
        };
        new Pagamento(addPagamento).save().then(() => {
            req.flash("success_msg", "Pagamento cadastrado com sucesso!");
            res.redirect('/pagamentos');
        }).catch((erro) => {
            req.flash("error_msg", "Error: Pagamento não foi cadastrado com sucesso");
            res.redirect('/cad-pagamento');
        });
    }

});

router.get('/del-pagamento/:id', (req, res) => {
    Pagamento.deleteOne({ _id: req.params.id }).then(() => {
        req.flash("success_msg", "Pagamento deletado com sucesso");
        res.redirect('/pagamentos');
    }).catch((erro) => {
        req.flash("error_msg", "Error: Pagamento não deletado");
        res.redirect('/pagamentos');
    })
})

/*CATEGORIAS DE PAGAMENTOS*/
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
    var errors = [];
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
        res.render("admin/edit-cat-pagamento", { catpagamento: catpagamento })
    }).catch((erro) => {
        req.flash("error_msg", "Error: Categoria de pagamento não encontrado!")
        res.redirect("/admin/cat-pagamento")
    })

})

router.post('/update-cat-pagamento', (req, res) => {
    CatPagamento.findOne({ _id: req.body.id }).then((catpagamento) => {
        catpagamento.nome = req.body.nome
        catpagamento.save().then(() => {
            req.flash("success_msg", "Categoria de pagamento editada com sucesso!")
            res.redirect("/cat-pagamento")
        }).catch((erro) => {
            req.flash("error_msg", "Error: Categoria de pagamento não foi editada com sucesso!")
            res.redirect("/cat-pagamento")
        })
    }).catch((erro) => {
        req.flash("error_msg", "Error: Categoria de pagamento não encontrado!")
        res.redirect("/cat-pagamento")
    })
})


router.get('/del-cat-pagamento/:id', (req, res) => {

    CatPagamento.deleteOne({ _id: req.params.id }).then(() => {
        req.flash("success_msg", "Categoria de pagamento deletada com sucesso!")
        res.redirect("/cat-pagamento");

    }).catch((erro) => {
        req.flash("error_msg", "Error: Categoria de pagamento não foi deletada!")
        res.redirect("/cat-pagamento");
    });

});

router.get('/visu-cat-pagamento/:id', (req, res) => {

    CatPagamento.findOne({ _id: req.params.id }).then((catpagamento) => {
        res.render('admin/visu-cat-pagamento', { catpagamento: catpagamento });

    }).catch((erro) => {
        req.flash("error_msg", "Error: Categoria de pagamento não foi deletada!")
        res.redirect("/cat-pagamento");
    });

});

//Exportar o módulo de rotas
module.exports = router;