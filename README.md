# LogosCard Back-End

O LogosCard é um sistema de cartão de benefícios para clientes a partir de uma assinatura anual. O sistema faz o controle e gerenciamento dos planos e faturas mensais. Aqui você encontrará o código back-end da aplicação. <a href="https://github.com/paulotss/logoscard_front" target="_blank">Clique aqui</a> para acessar o repositório do front-end.

### Tecnologias utilizadas

![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![Express.js](https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB)
![MySQL](https://img.shields.io/badge/mysql-%2300f.svg?style=for-the-badge&logo=mysql&logoColor=white)
![Sequelize](https://img.shields.io/badge/Sequelize-52B0E7?style=for-the-badge&logo=Sequelize&logoColor=white)

### Execução

Crie um arquivo .env com as variáveis de ambiemte para acesso ao banco de dados. Utilize o arquivo .envexample como modelo.

Você pode criar os containers utilizando o docker-compose:

`docker-compose up -d`

Parar acessar o container utilize:

`docker exec -it logoscard_back bash`

Para criar ou resetar o banco de dados:

`npm run db:reset`

Para rodar a aplicação:

`npm run dev`
