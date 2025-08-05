# Contributing to Titan Pomade

Thank you for considering contributing to Titan Pomade! We appreciate your time and effort in helping improve this project.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Pull Request Process](#pull-request-process)
- [Coding Standards](#coding-standards)
- [Commit Message Guidelines](#commit-message-guidelines)
- [Reporting Issues](#reporting-issues)
- [Feature Requests](#feature-requests)
- [License](#license)

## Code of Conduct

This project and everyone participating in it is governed by our [Code of Conduct](CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code.

## Getting Started

1. Fork the repository on GitHub
2. Clone your fork locally
   ```bash
   git clone git@github.com:yourusername/titan-pomade.git
   cd titan-pomade
   ```
3. Install dependencies
   ```bash
   pnpm install
   ```
4. Set up environment variables
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```
5. Start development services
   ```bash
   docker-compose up -d
   pnpm db:migrate
   pnpm dev
   ```

## Development Workflow

1. Create a feature branch
   ```bash
   git checkout -b feature/your-feature-name
   ```
2. Make your changes
3. Run tests
   ```bash
   pnpm test
   ```
4. Ensure code quality
   ```bash
   pnpm lint
   pnpm format
   ```
5. Commit your changes following the [commit message guidelines](#commit-message-guidelines)
6. Push to your fork
   ```bash
   git push origin feature/your-feature-name
   ```
7. Open a Pull Request

## Pull Request Process

1. Ensure any install or build dependencies are removed before the end of the layer when doing a build.
2. Update the README.md with details of changes to the interface, this includes new environment variables, exposed ports, useful file locations, and container parameters.
3. Increase the version numbers in any example files and the README.md to the new version that this Pull Request would represent. The versioning scheme we use is [SemVer](http://semver.org/).
4. Your pull request should target the `main` branch.
5. Ensure all tests pass and there are no linting errors.
6. You may merge the Pull Request once you have the sign-off of two other developers, or if you do not have permission to do that, you may request the second reviewer to merge it for you.

## Coding Standards

- Use TypeScript for all new code
- Follow the existing code style
- Write meaningful variable and function names
- Keep functions small and focused
- Add comments for complex logic
- Write tests for new features
- Update documentation when making changes

## Commit Message Guidelines

We follow [Conventional Commits](https://www.conventionalcommits.org/) for our commit messages. The format is:

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

### Types:

- `feat`: A new feature
- `fix`: A bug fix
- `docs`: Documentation only changes
- `style`: Changes that do not affect the meaning of the code (white-space, formatting, etc)
- `refactor`: A code change that neither fixes a bug nor adds a feature
- `perf`: A code change that improves performance
- `test`: Adding missing tests or correcting existing tests
- `chore`: Changes to the build process or auxiliary tools and libraries

### Examples:

```
feat(auth): add password reset functionality

Add password reset endpoint and email template

Closes #123
```

## Reporting Issues

When reporting issues, please include:

- A clear title and description
- Steps to reproduce the issue
- Expected vs actual behavior
- Screenshots if applicable
- Browser/OS version
- Any relevant error messages

## Feature Requests

We welcome feature requests! Please:

1. Check if the feature has already been requested
2. Explain why this feature would be useful
3. Provide as much detail as possible
4. Include any relevant links or references

## License

By contributing, you agree that your contributions will be licensed under the [MIT License](LICENSE).

## Thank You!

Your contributions to open source, large or small, make great projects like this possible. Thank you for taking the time to contribute.
