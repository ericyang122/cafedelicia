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
const usuarioSchema = new mongoose.Schema({
    email : {type : String, required : true},
    senha : {type : Number},
});

//criando a 2 model do seu projeto
const produtocafeteria = new mongoose.Schema({
    id_produtocafeteria : {type : String, required : true},
    descricao : {type : String},
    sobremesa : {type : String},
    DataValidade : {type : Date},
    quantidadeEstoque : {type : Number},
});

const usuario = mongoose.model("usuario", usuarioSchema);

app.post("/cadastrousuario", async (req, res) => {
    const email = req.body.email;
    const senha = req.body.senha; // Altere para req.body.senha para corresponder ao nome do campo do formulário

    // Testando se todos os campos foram preenchidos
    if (email == null || senha == null) {
        return res.status(400).json({ error: "Preencha todos os campos" });
    }

    // Testando se o email já existe
    const emailExiste = await usuario.findOne({ email: email });
    if (emailExiste) {
        return res.status(400).json({ error: "Este email já está em uso" });
    }

    // Criando um novo objeto de usuário com o modelo do Mongoose
    const novoUsuario = new usuario({
        email: email,
        senha: senha
    });

    try {
        // Salvando o novo usuário no banco de dados
        const usuarioSalvo = await novoUsuario.save();
        res.json({ error: null, msg: "Cadastro realizado com sucesso", usuarioId: usuarioSalvo._id });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});


const Produto = mongoose.model("produto", produtocafeteria);

app.post("/cadastroprodutocafeteria", async (req, res) => {
    const id_produtocafeteria = req.body.id_produtocafeteria;
    const descricao = req.body.descricao;
    const sobremesa = req.body.sobremesa;
    const DataValidade = req.body.DataValidade;
    const quantidadeEstoque = req.body.quantidadeEstoque;
    //testando c todos os campos foram preenchidos 
    if(id_produtocafeteria == null || descricao == null || sobremesa == null || DataValidade == null || quantidadeEstoque == null){
        return res.status(400).json({error : "preencha os campo"})
    }

//teste mais importante da ac 
    const idexiste = await usuario.findOne({id_produtocafeteria: id_produtocafeteria})
    if(idexiste){
        return res.status(400).json({error : "e email ja existe"})
    }

    const quantidadeEstoqueLimite = quantidadeEstoque
 
    if(quantidadeEstoqueLimite > 24){
        return res.status(400).json({error : "A quantidade de estoque foi atingido (20)"})
    }
    else if(quantidadeEstoqueLimite <= 0 ){
        return res.status(400).json({error : "Insira uma quantidade possível"})
    }

    const novoProduto = new Produto({
        id_produtocafeteria: id_produtocafeteria,
        descricao: descricao,
        sobremesa: sobremesa,
        DataValidade: DataValidade,
        quantidadeEstoque: quantidadeEstoque
    });

    try {
        const newProduto = await novoProduto.save();
        res.json({ error: null, msg: "Cadastro ok", produtoId: newProduto._id });
    } catch (error) {
        res.status(400).json({ error });
    }
});


app.get("/cadastrousuario", async(req, res)=>{
    res.sendFile(__dirname +"/cadastrousuario.html");
})

app.get("/cadastroprodutocafeteria", async(req, res)=>{
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

