const express = require("express")
const app = express();
const mysql = require('mysql')
const bodyParser = require('body-parser')

const { existsOrError, notExistsOrError, equalsOrError } = require('./validation')


app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))

const connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'username',
  password : '123',
  database : 'db_teste_backend'
})

connection.connect((err) => {
    if(err) throw err;
    console.log('Connected to MySQL Server!');
})

app.get("/usuarios",(req,res) => {
    connection.query('SELECT * from usuarios', (error, rows) => {
        if (error){
            const msg = {
                "codigo": 400,
                "status": "erro",
                "mensagem": error,
            }
            return res.status(400).send(msg)
        } else {
            const usuarios = {
                "codigo": 200,
                "status": "sucesso",
                "mensagem": "Ação Realizada com sucesso",
                "dados": rows
            }
            res.json(usuarios)
        }
    })
})

// Retrieve user with id 
app.get('/usuarios/:id', function (req, res) {
    let user_id = req.params.id;
    if (!user_id) {
        return res.status(400).send({ error: true, message: 'Please provide user_id' })
    }
    connection.query('SELECT * FROM usuarios where id_usuario=?', user_id, function (error, results, fields) {
        if (error){
            const msg = {
                "codigo": 400,
                "status": "erro",
                "mensagem": error,
            }
            return res.status(400).send(msg)
        } else {
            const usuario = {
                "codigo": 200,
                "status": "sucesso",
                "mensagem": "Ação Realizada com sucesso",
                "dados": results
            }
            res.json(usuario)
        } 
    })
})

app.post("/usuarios",(req,res) => {
    let user = req.body
    const values = [
        user.nome,
        user.sobrenome,
        user.email,
        user.telefone,
        user.cpf
    ]

        try{
            existsOrError(user.nome,'Nome não informado')
            existsOrError(user.sobrenome,'Sobrenome não informado')
            existsOrError(user.email,'E-mail não informado')
            existsOrError(user.telefone,'Telefone não informado')
            existsOrError(user.cpf,'Cpf não informado')

            const query = 'SELECT * FROM usuarios WHERE email=? OR cpf=?'

            connection.query(query, [user.email,user.cpf], function (error, results ) {
                const userFromDb = {...results[0]}

                if(userFromDb.id_usuario){
                    return res.status(400).send('Usuário ja cadastrado!')
                } else {
                // NOVO USUARIO
                   const query =  'INSERT INTO usuarios (nome, sobrenome, email, telefone, cpf) VALUES (?)'
                    connection.query(query, [values], (error, rows) => {
                        if (error){
                            const msg = {
                                "codigo": 400,
                                "status": "erro",
                                "mensagem": error,
                            }
                            return res.status(400).send(msg)
                        } else {
                            const resultado = {
                                "codigo": 200,
                                "status": "sucesso",
                                "mensagem": "Ação Realizada com sucesso",
                            }
                            res.json(resultado)
                        }
                    })
                } 
            })

        }catch(msg){
            return res.status(400).send(msg)
        }
})

//DELETE USUARIO
app.delete('/usuarios/:id', function (req, res) {
    const user_id = parseInt(req.params.id)

    if (!user_id) {
        return res.status(400).send({ error: true, message: 'Please provide user_id' })
    }
    connection.query('DELETE FROM usuarios where id_usuario=' + user_id, (error, results, fields) => {
        if (error){
            const msg = {
                "codigo": 400,
                "status": "erro",
                "mensagem": error,
            }
        return res.status(400).send(msg)
        } else {
            const resultado = {
                "codigo": 200,
                "status": "sucesso",
                "mensagem": "Ação Realizada com sucesso",
            }
            res.json(resultado)
        } 
    })
})

//UPDATE USUARIO
app.put('/usuarios/:id', function (req, res) {
    const user_id = parseInt(req.params.id)
    const user = req.body

        if (!user_id) {
        return res.status(400).send({ error: true, message: 'Please provide user_id' })
    }
const query  = `UPDATE usuarios SET nome='${user.nome}', sobrenome='${user.sobrenome}' WHERE id_usuario=${user_id}`

    connection.query(query, (error, results, fields) => {
    //if (error) throw error;
        if (error){
            const msg = {
                "codigo": 400,
                "status": "erro",
                "mensagem": error,
            }
        return res.status(400).send(msg)
        } else {
            const resultado = {
                "codigo": 200,
                "status": "sucesso",
                "mensagem": "Ação Realizada com sucesso",
            }
            res.json(resultado)
        } 
    })
})


//ENDEREÇOS
//1.1 Método [GET]
/*
- URL {{url-base}}/enderecos-usuario/:id_usuario
- Função: Listar todos os endereços de acordo com o usuário especificado via
url: id_usuario
*/

app.get("/enderecos-usuario/:id_usuario",(req,res) => {
    
    const query = 'SELECT * FROM enderecos_usuario WHERE id_usuario=' + parseInt(req.params.id_usuario)
    connection.query(query, (error, rows) => {
        if (error){
            const msg = {
                "codigo": 400,
                "status": "erro",
                "mensagem": error,
            }
            return res.status(400).send(msg)
        } else {
            const usuarios = {
                "codigo": 200,
                "status": "sucesso",
                "mensagem": "Ação Realizada com sucesso",
                "dados": rows
            }
            res.json(usuarios)
        }
    })
})


/*
1.2 Método [GET]
- URL {{url-base}}/enderecos-usuario/:id_endereco_usuario
- Função: Listar endereço especificado via url: id_endereco_usuario
*/

app.get("/enderecos-usuario/:id_endereco_usuario",(req,res) => {
    
    const query = 'SELECT * FROM enderecos_usuario WHERE id_endereco_usuario=' + parseInt(req.params.id_endereco_usuario)
    connection.query(query, (error, rows) => {
        if (error){
            const msg = {
                "codigo": 400,
                "status": "erro",
                "mensagem": error,
            }
            return res.status(400).send(msg)
        } else {
            const usuarios = {
                "codigo": 200,
                "status": "sucesso",
                "mensagem": "Ação Realizada com sucesso",
                "dados": rows
            }
            res.json(usuarios)
        }
    })
})




//1.3 Método [POST]
//- URL {{url-base}}/enderecos-usuario

app.post("/enderecos-usuario",(req,res) => {
    let endereco = req.body
    const values = [
        endereco.id_usuario,
        endereco.logradouro,
        endereco.numero,
        endereco.cidade,
        endereco.uf,
        endereco.cep,
        endereco.bairro,
        endereco.complemento
    ]

    try{
        existsOrError(endereco.id_usuario, 'Id do Usuário não informado')
        existsOrError(endereco.logradouro, 'Logradouro não informado')
        existsOrError(endereco.numero, 'Número não informado')
        existsOrError(endereco.cidade, 'Cidade não informada')
        existsOrError(endereco.uf, ' UF não informada')
        existsOrError(endereco.cep, 'CEP não informado')
        existsOrError(endereco.bairro, 'Bairro não informado')
        existsOrError(endereco.complemento, 'Complemento não informado')

       const query = 'INSERT INTO enderecos_usuario (id_usuario, logradouro, numero, cidade, uf, cep, bairro, complemento) VALUES (?)'

        connection.query(query, [values], (error, rows) => {
        if (error){
            const msg = {
                "codigo": 400,
                    "status": "erro",
                    "mensagem": error,
                }
                return res.status(400).send(msg)
            } else {
                const resultado = {
                    "codigo": 200,
                    "status": "sucesso",
                    "mensagem": "Ação Realizada com sucesso",
                }
                res.json(resultado)
            }
        })
    }catch(msg){
        return res.status(400).send(msg)
    }
})


/*
1.4 Método [DELETE]
- URL {{url-base}}/enderecos-usuario/:id_endereco_usuario
- Função: Remover endereço especificado via url: id_endereco_usuario
*/

app.delete('/enderecos-usuario/:id_endereco_usuario', function (req, res) {
    const id_endereco_usuario = parseInt(req.params.id_endereco_usuario)

    if (!id_endereco_usuario) {
        return res.status(400).send({ error: true, message: 'Please provide user_id' })
    }
    const query =  'DELETE FROM enderecos_usuario where id_endereco_usuario=' + id_endereco_usuario

    connection.query(query, (error, results) => {
        if (error){
            const msg = {
                "codigo": 400,
                "status": "erro",
                "mensagem": error,
            }
        return res.status(400).send(msg)
        } else {
            const resultado = {
                "codigo": 200,
                "status": "sucesso",
                "mensagem": "Ação Realizada com sucesso",
            }
            res.json(resultado)
        } 
    })
})

/*
1.1 Método [PUT]
- URL {{url-base}}/enderecos-usuario/:id_endereco_usuario
- Função: Editar endereço especificado via url: id_enderec
*/
app.put('/enderecos-usuario/:id_endereco_usuario', function (req, res) {

    const id_endereco_usuario = parseInt(req.params.id_endereco_usuario)

    let endereco = req.body
    const values = [
        endereco.id_usuario,
        endereco.logradouro,
        endereco.numero,
        endereco.cidade,
        endereco.uf,
        endereco.cep,
        endereco.bairro,
        endereco.complemento
    ]

    if (!id_endereco_usuario) {
        return res.status(400).send({ error: true, message: 'Please provide id_endereco_usuario' })
    }
    let query = 'UPDATE enderecos_usuario SET '

    if(endereco.logradouro) query += `logradouro = '${endereco.logradouro}',`
    if(endereco.numero) query += `numero = '${endereco.numero}', `
    if(endereco.cidade) query += `cidade = '${endereco.cidade}', `
    if(endereco.uf) query += `uf = '${endereco.uf}', `
    if(endereco.cep) query += `cep = '${endereco.cep}', `
    if(endereco.bairro) query += `bairro = '${endereco.bairro}', `
    if(endereco.complemento) query += `complemento = '${endereco.complemento}' `

    connection.query(query, (error, results, fields) => {
    //if (error) throw error;
        if (error){
            const msg = {
                "codigo": 400,
                "status": "erro",
                "mensagem": error,
            }
        return res.status(400).send(msg)
        } else {
            const resultado = {
                "codigo": 200,
                "status": "sucesso",
                "mensagem": "Ação Realizada com sucesso",
            }
            res.json(resultado)
        } 
    })
})

app.listen(3000, () => {
    console.log('Server is running at port 3000')
})
