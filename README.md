# Continuous Integration (CI)

This repository contains the source code for [Full Cycle course](https://fullcycle.com.br/certificado/d461a464-69c5-421b-a6dd-e1cfb00a93fc/) I took to practice CI pipelines. It uses GitHub Actions to automate Continuous Integration (CI) workflows, ensuring code quality and proper deployment pipelines. The CI workflows configured in this project are designed to build, test, analyze, and deploy the code efficiently and effectively.

Continuous Integration (CI) is a software development practice where developers frequently integrate code changes into a shared repository, ideally several times a day. Each integration is automatically verified by building the application and running automated tests. This practice helps detect issues early, improves code quality, and speeds up the development process.

## Workflows

### Build & Push Docker Image Pipeline

**Filename**: `.github/workflows/docker.yml`

**Purpose**: This workflow automates the process of building Docker images and pushing them to Docker Hub. It ensures that the Docker images are always up-to-date with the latest code changes.

**Triggers**:
- Push events to `develop` or `main` branches.
- Pull request events for `develop` or `main` branches.

**Steps**:
1. **Docker Meta**: Generates metadata for the Docker image.
2. **Set up QEMU**: Enables cross-platform builds by setting up QEMU.
3. **Set up Docker Buildx**: Configures Docker Buildx for advanced build features.
4. **Login to Docker Hub**: Logs into Docker Hub (only for non-pull request events).
5. **Build and Push**: Builds and pushes the Docker image to Docker Hub if the conditions are met.

```yaml
name: Build & Push Docker Image Pipeline

on:
  push:
    branches: [develop, main]
  pull_request:
    branches: [develop, main]

env:
  DOCKERHUB_USERNAME: ${{ secrets.DOCKERHUB_USERNAME }}
  DOCKERHUB_PASSWORD: ${{ secrets.DOCKERHUB_PASSWORD }}

jobs:
  build:
    name: Build and Push Docker Image
    runs-on: ubuntu-latest
    steps:
      - name: Docker meta
        id: meta
        uses: docker/metadata-action@v5
        with:
          images: dalloglio/fc-ci

      - name: Set up QEMU
        uses: docker/setup-qemu-action@v3

      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v3

      - name: Login to Docker Hub
        if: github.event_name != 'pull_request'
        uses: docker/login-action@v3
        with:
          username: ${{ env.DOCKERHUB_USERNAME }}
          password: ${{ env.DOCKERHUB_PASSWORD }}

      - name: Build and Push
        uses: docker/build-push-action@v5
        with:
          push: ${{ github.event_name != 'pull_request' }}
          tags: ${{ steps.meta.outputs.tags }}
          labels: ${{ steps.meta.outputs.labels }}
```

### SonarCloud Code Analysis Pipeline

**Filename**: `.github/workflows/sonarcloud.yml`

**Purpose**: This workflow integrates with SonarCloud to perform code quality and coverage analysis. It ensures that the code adheres to quality standards and helps identify potential issues early in the development process.

**Triggers**:
- Push events to `develop` or `main` branches.
- Pull request events for `develop` or `main` branches (opened, synchronized, or reopened).

**Steps**:
1. **Git Checkout**: Checks out the repository code with full history.
2. **Set up Node.js**: Sets up Node.js version 18 and caches `node_modules`.
3. **Install Dependencies**: Installs project dependencies using `npm ci`.
4. **Test Coverage**: Runs the test suite and generates a coverage report.
5. **SonarCloud Scan**: Performs a SonarCloud scan to analyze code quality and coverage.

```yaml
name: SonarCloud Code Analysis Pipeline

on:
  push:
    branches: [develop, main]
  pull_request:
    branches: [develop, main]
    types: [opened, synchronize, reopened]

jobs:
  analysis:
    name: SonarCloud Analysis
    runs-on: ubuntu-latest
    steps:
      - name: Git Checkout
        uses: actions/checkout@v4
        with:
          fetch-depth: 0

      - name: Set up Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 18
          cache: "npm"

      - name: Install dependencies
        run: npm ci

      - name: Test Coverage
        run: npm test -- --coverage

      - name: SonarCloud Scan
        uses: SonarSource/sonarcloud-github-action@v2
        env:
          SONAR_TOKEN: ${{ secrets.SONAR_TOKEN }}
        with:
          args:
            -Dsonar.projectKey=dalloglio_fc-ci
            -Dsonar.organization=dalloglio
            -Dsonar.sources=.
            -Dsonar.exclusions=**/*.spec.ts
            -Dsonar.tests=.
            -Dsonar.test.inclusions=**/*.spec.js
            -Dsonar.javascript.coveragePlugin=lcov
            -Dsonar.javascript.lcov.reportPaths=coverage/lcov.info
          projectBaseDir: .
```

## Secrets

The workflows use the following GitHub Secrets to securely store sensitive information:
- `DOCKERHUB_USERNAME`: Docker Hub username.
- `DOCKERHUB_PASSWORD`: Docker Hub password.
- `SONAR_TOKEN`: SonarCloud authentication token.

## Conclusion

These CI workflows help maintain code quality and streamline the development process by automating essential tasks such as building Docker images and analyzing code quality. By leveraging GitHub Actions and SonarCloud, this project ensures that every code change is thoroughly tested and reviewed, leading to a more reliable and robust codebase.
