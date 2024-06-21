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

Development mode
```bash
$ yarn run start
```
Watch mode
```bash
$ yarn run start:dev
```
Production mode
```bash
$ yarn run start:prod
```

## Test

Unit tests
```bash 
$ yarn run test
```
E2e tests
```bash
$ yarn run test:e2e
```
Test coverage
```bash
$ yarn run test:cov
```

## Migrations

Generate a migration
```bash
$ yarn migration:generate "src/database/migrations/MigrationName"
```
Run a migration
```bash
$ yarn migration:run
```
Revert a migration
```bash
$ yarn migration:revert
```

## Swagger API

Access swagger api
```bash
$ http://localhost:3000/api
```
