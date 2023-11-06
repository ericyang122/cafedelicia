const mongoose = require("mongoose");
const express = require("express");
const bodyParser = require("body-parser");


//configurando o roteamento para teste no postman
const app = express();
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
const port = 3000;


//configurando o acesso ao mongodb
mongoose.connect('mongodb://127.0.0.1:27017/cafedelicia',
{   useNewUrlParser: true,
    useUnifiedTopology: true,
    //serverSelectionTimeoutMS : 20000
});


//criando a model do seu projeto
const UsuarioSchema = new mongoose.Schema({
    usuario : {type : String},
    email : {type : String, required : true},
    senha : {type : Number},
});

//criando a 2 model do seu projeto
const produtocafeteria = new mongoose.Schema({
    id_produtocafeteria : {type : String},
    descricao : {type : String},
    sobremesa : {type : String},
    DataValidade : {type : Date, required : true},
    quantidadeEstoque : {type : Number},
});

const Pessoa = mongoose.model("Pessoa", UsuarioSchema,);


app.post("/cadastropessoa", async(req, res)=>{
    const usuario = req.body.nome;
    const email = req.body.email;
    const senha = req.body.numero;

    const pessoa = new Pessoa({
        usuario : usuario,
        email : email,  
        senha : senha
    })

    try{
        const newPessoa = await pessoa.save();
        res.json({error : null, msg : "Cadastro ok", pessoaId : newPessoa._id});
    } catch(error){
        res.status(400).json({error});
    }
});

const Produto = mongoose.model("produto", produtocafeteria);

app.post("/cadastroproduto", async(req, res)=>{
    const id_produtocafeteria = req.body.id_produtocafeteria;
    const descricao = req.body.descricao;
    const sobremesa = req.body.sobremesa;
    const DataValidade = req.body.DataValidade;
    const quantidadeEstoque = req.body.quantidadeEstoque;

    const Produto = new Produto({
        id_produtocafeteria : id_produtocafeteria,
        descricao : descricao,
        sobremesa : sobremesa,
        DataValidade : DataValidade,
        quantidadeEstoque : quantidadeEstoque
    })

    
    try{
        const newProduto = await Produto.save();
        res.json({error : null, msg : "Cadastro ok", produtoId : newProduto._id});
    } catch(error){
        res.status(400).json({error});
    }

});



app.get("/cadastrousuario", async(req, res)=>{
    res.sendFile(__dirname +"/cadastropessoa.html");
})

app.post("/cadastroprodutocafeteria", async(req, res)=>{
    res.sendFile(__dirname +"/cadastroprodutocafeteria.html");
})

//rota raiz
app.get("/", async(req, res)=>{
    res.sendFile(__dirname +"/index.html");
})

//configurando a porta
app.listen(port, ()=>{
    console.log(`Servidor rodando na porta ${port}`);
})

