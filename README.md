# Hyper Focus Backend

This repository is designated for storing all backend-related code for the platform.

## Installation

```bash
$ yarn install
```

## Running the app

```bash
# development
$ yarn run start

# watch mode
$ yarn run start:dev

# production mode
$ yarn run start:prod
```

## Test

```bash
# unit tests
$ yarn run test

# e2e tests
$ yarn run test:e2e

# test coverage
$ yarn run test:cov
```

## Migrations

```bash
# generate a migration
$ yarn migration:generate "src/database/migrations/MigrationName"

# run a migration
$ yarn migration:run

# revert a migration
$ yarn migration:revert
```

## Swagger API

```bash
# access swagger api
$ http://localhost:3000/api
```
