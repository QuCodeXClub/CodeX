# CodeX Documentation

This directory houses the comprehensive documentation for the CodeX project, detailing architecture, security, deployment, and API design.

## Documentation Index

Please refer to the following markdown files for in-depth insights into specific areas of the project:

- **[Architecture](./architecture.md)**: Details the MVC-inspired structure of the backend, the flow of requests, and folder responsibilities.
- **[Database](./database.md)**: Thoroughly explains the MongoDB collections (Users, Events, Registrations, Teams), schemas, and relationships.
- **[API Reference](./api-reference.md)**: A detailed guide to the available REST API endpoints and their expected payloads/responses.
- **[Authentication](./authentication.md)**: Describes how JWT, sessions, and bcrypt are used to secure the platform.
- **[Environment](./environment.md)**: Details the required `.env` variables and their purposes across different environments.
- **[Middleware](./middleware.md)**: Explains custom Express middleware like auth guards, rate limiters, and error handlers.
- **[Security](./security.md)**: Highlights the measures taken to secure the application against common vulnerabilities (e.g., CORS, Helmet, Mongo Sanitize).
- **[Deployment](./deployment.md)**: Guides on how to deploy the application to production environments.
- **[Development Guide](./development-guide.md)**: Best practices and conventions for writing maintainable code in this repository.
- **[Project Structure](./project-structure.md)**: An overview of the backend's directory layout and standard practices.
- **[Getting Started](./getting-started.md)**: A more detailed companion to the root README for setting up the environment.

## OpenAPI Specification
- **`openapi.yaml`**: The raw OpenAPI (Swagger) specification file used to generate the interactive API documentation available at `/api-docs` when running the backend.
