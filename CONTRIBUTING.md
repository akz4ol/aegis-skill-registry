# Contributing to AegisSkill Registry

First off, thank you for considering contributing to AegisSkill Registry! It's people like you that make this project a great tool for the AI agent community.

## Code of Conduct

This project and everyone participating in it is governed by our Code of Conduct. By participating, you are expected to uphold this code.

## How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check the existing issues to avoid duplicates. When you create a bug report, include as many details as possible using our bug report template.

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion:

- Use a clear and descriptive title
- Provide a step-by-step description of the suggested enhancement
- Explain why this enhancement would be useful

### Pull Requests

1. Fork the repo and create your branch from `main`
2. If you've added code that should be tested, add tests
3. Ensure the test suite passes (`npm test`)
4. Make sure your code lints (`npm run lint`)
5. Update documentation as needed

## Development Setup

```bash
# Clone your fork
git clone https://github.com/YOUR_USERNAME/aegis-skill-registry.git

# Install dependencies
npm install

# Set up environment
cp .env.example .env

# Start development server
npm run dev
```

## Style Guide

### TypeScript

- Use TypeScript for all new code
- Follow the existing code style
- Use meaningful variable and function names
- Add JSDoc comments for public APIs

### Git Commit Messages

- Use the present tense ("Add feature" not "Added feature")
- Use the imperative mood ("Move cursor to..." not "Moves cursor to...")
- Limit the first line to 72 characters
- Reference issues and pull requests when relevant

### Code Review Process

1. All submissions require review
2. We use GitHub pull requests for this purpose
3. Reviewers may request changes before merging

## Testing

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

## Documentation

- Update README.md with details of changes to the interface
- Update API documentation for endpoint changes
- Add JSDoc comments for new functions

## Questions?

Feel free to open a discussion in the GitHub Discussions tab!
