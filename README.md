# Hyper Focus Backend
Hyper Focus is a platform to assist people with ADHD by facilitating their daily lives, improving their quality of life, and interaction with society. It Provides tools to assist people with ADHD in their daily lives, such as: social network, calendar, notes, disorder identification tests, gamification, and interaction with specialized doctors. These tools can contribute to the improvement of academic, professional, and social performance of those suffering from the disorder.

This repository is designated for storing all backend-related code for the platform.

## Installation

```bash
$ yarn install
```

## Running the Docker Container

```bash
$ docker compose -p hyper-focus up -d --build -V
```

## Running the app

```bash
# development mode
$ yarn run start
```
```bash
# watch mode
$ yarn run start:dev
```
```bash
# production mode
$ yarn run start:prod
```

## Test

```bash
# unit tests
$ yarn run test
```
```bash
# e2e tests
$ yarn run test:e2e
```
```bash
# test coverage
$ yarn run test:cov
```

## Migrations

```bash
# generates a migration
$ yarn migration:generate "src/database/migrations/MigrationName"
```
```bash
# runs a migration
$ yarn migration:run
```
```bash
# reverts a migration
$ yarn migration:revert
```

## Swagger API

```bash
# access swagger api
$ http://localhost:3000/api
```
