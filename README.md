<h1 align="center">AnyList</h1>

<div align="center">

[![NestJS](https://img.shields.io/badge/NestJS-9.4.3-red)](https://github.com/nestjs/nest)
[![TypeScript](https://img.shields.io/badge/%3C%2F%3E-TypeScript-%230074c1.svg)](#)
[![Linter](https://badges.aleen42.com/src/eslint.svg)](#)
[![Formatter: prettier](https://img.shields.io/badge/Formatter-Prettier-f8bc45.svg)](#)
[![App](https://img.shields.io/badge/App-1.0.0-green)](#)

</div>

<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
  <a href="https://graphql.org/" target="blank"><img src="https://graphql.org/img/logo.svg" width="200" alt="GraphQL Logo" /></a>

</p>

<div align="center" >

| Preview                                                                                       |
| --------------------------------------------------------------------------------------------- |
| ![Preview](https://res.cloudinary.com/dms5y8rug/image/upload/v1686627677/AnyList/anylist.gif) |

</div>

# Demo

```
https://anylist-api-graphql-2.onrender.com/graphql
```

## Clone

`$ git clone `

## Getting started

```
$ yarn install
$ npm i -g @nestjs/cli
$ docker-compose up -d
```

> **Warning**
>
> Copy the `.env.template` rename the copy to `.env` and edit or fill in the value of the variables defined in the `.env` if necessary.

## Launch API

```
$ yarn start:dev
```

> Visit: `http://localhost:3000/graphql`

> **Note**
>
>Execute the `executeSeed` mutation to populate the database with information.

## VSCode extensions

- Prettier
- ESLint

## Libraries used

- NestJS
- TypeScript
- QraphQL
- TypeORM
- Apollo ( @apollo/server & Apollo Studio for Playground )
- PostgreSQL client ( pg )
- Passport & JWT
- Joi
- Bcryptjs
- Tailwind CSS
