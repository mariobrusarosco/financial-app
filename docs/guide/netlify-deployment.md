# Netlify Deployment Guide

## Overview
Better Call Buffet uses Netlify for hosting and deployment, leveraging the partnership between TanStack and Netlify for optimized deployment of TanStack applications.

## Configuration
The deployment is configured through a `netlify.toml` file in the root directory, which specifies build commands, environment variables, and deployment settings.

## Deployment Process
1. Changes are pushed to the main branch
2. Netlify automatically detects changes and starts the build process
3. The application is built using the configured build command
4. The built application is deployed to Netlify's global CDN

## Environment Variables
Environment variables are managed through the Netlify dashboard. Critical variables include:
- `VITE_API_BASE_URL`: URL of the Better Call Buffet API

## Previews
Netlify automatically creates preview deployments for pull requests, allowing for testing changes before merging to main.

## Monitoring
Deployment status and performance metrics can be monitored through the Netlify dashboard. 