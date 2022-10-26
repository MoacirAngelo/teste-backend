# Teste Backend 
Projeto para o teste para vaga de backend na M10web.

## 🚀 Começando

Essas instruções permitirão que você obtenha uma cópia do projeto em operação na sua máquina local para fins de desenvolvimento e teste.


## 🖥️ Como rodar este projeto?
Para iniciar essa aplicação localmente, é preciso baixar este reepositório e modificar o arquivo chamado de *env_file*.Esse arquivo precisa ser renomeado para *.env* e os valores das variáveis devem ser configuradas de acordo com a sua conexão de banco de dados.
```
-Crie o Banco de dados MySQL usando phpmyadmin ou outro Gerenciador de banco de dados.
```
### Crie as tabelas do banco de dados
```
 CREATE TABLE IF NOT EXISTS usuarios (
    id_usuario int(11) AUTO_INCREMENT PRIMARY KEY,
    nome varchar(255) NOT NULL,
    sobrenome varchar(255) NOT NULL,
    email varchar(255) UNIQUE NOT NULL,
    telefone varchar(45) NOT NULL,
    cpf varchar(45) UNIQUE NOT NULL
  );

CREATE TABLE enderecos_usuario(
    id_endereco_usuario int(11) AUTO_INCREMENT PRIMARY KEY,
    id_usuario int(11) AUTO_INCREMENT PRIMARY KEY,
    logradouro varchar(255) NOT NULL,
    numero varchar(45) NOT NULL,
    cidade varchar(255) NOT NULL,
    uf varchar(2) NOT NULL,
    cep varchar(45),
    bairro varchar(255) NOT NULL,
    complemento varchar(255) NOT NULL,

    FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario)
);
```



- Rode os comandos **npm i** para instalar as dependências e **npm start** para iniciar o projeto.




