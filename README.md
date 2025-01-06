<p  align="center"  width="100%">

<img  width="128px"  src="images/favicon.ico"  alt="Zeztra">

</p>

## Desafio FullStack Zeztra

**Façam a leitura deste documento com muita atenção do começo ao fim.**

O intuito deste teste é avaliar seus conhecimento técnicos com a stack MERN (Mongo, Express, React, Nodejs), fazendo uso do NextJS e Typescript (tanto no front-end quanto no back-end).

O teste consiste em ler <a  href="https://github.com/Zeztra/desafio_vaga/blob/main/transacoes.txt">este arquivo de texto</a>, salvar os clientes e atrelar as transações a eles, além de apresentar esses dados em tela no ReactJS.

O teste pode ser realizado em quanto tempo quiser, porém, gostariamos que realizasse em não mais que algumas poucas horas.

## Instruções para o desafio

1. Faça um fork deste projeto para a sua conta no Github (crie uma caso não tenha);

2. Em seguida, impletemente os projetos tal qual descrito abaixo, em seu clone local;

3. Use a pasta frontend para o portal, e backend para a API;

4. Para a entrega do teste, envie um email com o link do Github para **vitor.ricardo@zeztra.com**.

## Descrição do Teste

Uma empresa recebe diariamente um arquivo TXT com várias conciliações de pagamentos de seus clientes.

Seu objetivo é criar um projeto usando NextJS com Typescript, fazer upload do arquivo TXT enviar para a API em NodeJS/Typescript, armazenar no MongoDB e as suas transações.

#### O portal Web deve conter as seguintes funcionalidades:

Tela de dashboard, com:

- [ ] botão com upload do arquivo TXT;

- [ ] tabela com a listagem de transações paginada, ordenada pela data da transação;
- [ ] Filtros de busca para listagem, com por exemplo: por nome e/ou range de data da transação;

Fique a vontade para usar alguma lib que auxilie no layout.

#### A API deve ter os seguintes endpoints, seguindo suas respectitivas regras de negócio:

1. Endpoint para receber o arquivo txt das transações, e para cada linha do TXT:

- [ ] Cadastrar o cliente no banco de dados, caso não exista;

- [ ] Cadastrar a transação relacionada ao cliente;

- [ ] Não deixar duplicar a transação, caso ela já exista na base;
- [ ] Calcule o tempo da execução da leitura completa do arquivo.

2. Endpoint de listagem de transação;

- [ ] Preferencialmente, faça a paginação para o frontend direto na consulta;
- [ ] Aplique os filtros de buscas;

#### Avaliação

Seu projeto será avaliado de acordo com os seguintes critérios:

1. Sua aplicação atende os requisitos básicos?

2. Você documentou no README o que deve ser feito para ela rodar?

3. Como foi arquitetou ambos os projetos.

4. Seu conhecimento geral sobre a stack MERN.

Boa sorte!
