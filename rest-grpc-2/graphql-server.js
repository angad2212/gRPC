const express = require('express');
const { buildSchema } = require('graphql');
const { graphqlHTTP } = require('express-graphql');

// In-memory store: id -> { id, name, email }
const users = new Map();
let nextId = 1; // auto-incrementing id starting at 1

// GraphQL schema
const schema = buildSchema(`
  type User {
    id: Int!
    name: String!
    email: String!
  }

  type Query {
    getUser(id: Int!): User
    listUsers: [User!]!
  }

  type Mutation {
    createUser(name: String!, email: String!): User!
  }
`);

// Resolvers
const root = {
  // Queries
  getUser: ({ id }) => {
    return users.get(id) || null;
  },
  listUsers: () => {
    return Array.from(users.values());
  },

  // Mutations
  createUser: ({ name, email }) => {
    if (!name || !email) {
      throw new Error('name and email are required');
    }
    const id = nextId++;
    const user = { id, name, email };
    users.set(id, user);
    return user;
  }
};

// Server
const app = express();
app.use('/graphql', graphqlHTTP({ schema, rootValue: root, graphiql: true }));

const PORT = 4000;
app.listen(PORT, () => {
  console.log(`GraphQL server running at http://localhost:${PORT}/graphql`);
});


