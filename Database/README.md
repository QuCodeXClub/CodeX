# CodeX Database Design

This directory serves as the repository for all database-related schema design diagrams, initialization scripts, or snapshot backups for the CodeX project. 

## Structure

Currently, this folder contains the following assets:

- **`CodeXDB.png`**: The Entity-Relationship (ER) diagram representing the database architecture of the CodeX platform. This visually outlines the core collections (such as Users, Events, Registrations, Teams) and the references between them.

## Database Technology

The CodeX project utilizes **MongoDB** as its primary data store, managed through the Mongoose Object Data Modeling (ODM) library in the Node.js backend. 

For an in-depth explanation of the data models, indexing strategies, and relationships, refer to the [Database Documentation](../docs/database.md) in the `docs` folder.

## Database Initialization (Optional)

If in the future there are seed files, data migrations, or backup restoration scripts required for local development or production, they will reside in this directory. 
Currently, seed data (like the default Admin account) is dynamically created by the Backend on startup via `seedAdmin.js`.
