# CI/CD Guide for Better Call Buffet

This guide explains the Continuous Integration and Continuous Deployment (CI/CD) workflows set up for the Better Call Buffet financial application.

## Overview

Our CI/CD pipeline consists of two main components:

1. **Continuous Integration (CI)** - Ensures code quality through automated testing
2. **Continuous Deployment (CD)** - Automates the deployment process to production

## Workflow Files

The CI/CD pipeline is defined in the following GitHub Actions workflow files:

- `.github/workflows/ci.yml` - Core CI workflow for testing and validation
- `.github/workflows/deploy-production.yml` - Production deployment workflow

## CI Workflow

The CI workflow runs automatically on:
- All pull requests to the `main` branch
- All pushes to the `main` branch

### What the CI Workflow Does

1. Checks out the code
2. Sets up Node.js with Yarn caching
3. Installs dependencies
4. Runs linting
5. Checks code formatting
6. Performs TypeScript type checking
7. Runs automated tests
8. Builds the application
9. Uploads the build artifact for later use

### Viewing CI Results

You can view the results of CI runs:
1. Go to the GitHub repository
2. Click on "Actions" tab
3. Find the relevant workflow run
4. Review the detailed logs and results

## Deployment Workflow

The production deployment workflow runs automatically when code is pushed to the `main` branch.

### What the Deployment Workflow Does

1. Checks out the code
2. Sets up Node.js with Yarn caching
3. Installs dependencies
4. Runs linting, type checking, and tests
5. Builds the application
6. Deploys to production (placeholder step - needs configuration)

### Customizing Deployment

The deployment step currently contains placeholder commands. To configure it for your specific deployment target:

1. Edit `.github/workflows/deploy-production.yml`
2. Replace the placeholder commands in the "Deploy to production" step with your actual deployment commands
3. Add any required secrets to your GitHub repository:
   - Go to repository Settings > Secrets and variables > Actions
   - Add New repository secret
   - Give it a meaningful name (referenced as `${{ secrets.SECRET_NAME }}` in workflows)

## Adding Preview Environments (Future)

In the future, we plan to add preview environments for pull requests. This would:

1. Create a temporary deployment for each pull request
2. Allow reviewers to interact with the changes before merging
3. Automatically tear down the environment when the PR is closed

## Troubleshooting

If a CI or deployment workflow fails:

1. Check the workflow logs on GitHub Actions
2. Common issues include:
   - Linting or formatting errors - Run `yarn lint` and `yarn format` locally
   - Type errors - Run `yarn tsc --noEmit` locally
   - Failed tests - Run `yarn test` locally
   - Build errors - Run `yarn build` locally

## Extending the Workflow

To add new steps to the CI/CD pipeline:

1. Fork the repository
2. Edit the workflow files in `.github/workflows/`
3. Create a pull request with your changes
4. Include detailed explanation of the changes in the PR description 