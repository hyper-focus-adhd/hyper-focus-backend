# Hyper Focus Backend

This repository is designated for storing all backend-related code for the platform.

## Installation

```bash
$ yarn install
```

## Running the app

```bash
# development mode
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
# generates a migration
$ yarn migration:generate "src/database/migrations/MigrationName"

# runs a migration
$ yarn migration:run

# reverts a migration
$ yarn migration:revert
```

## Swagger API

```bash
# access swagger api
$ http://localhost:3000/api
```
