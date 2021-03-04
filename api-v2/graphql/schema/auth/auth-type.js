const gql = require('graphql-tag')

module.exports = gql`
    type UserType {
        username: String
        password: String!
        given_name: String!
        family_name: String!
        email: String!
        group: String
        linked_instructor: ID
        isAdvisor: Boolean
        avatar_url: String
        createdAt: String
        remarks: [ID]
        resetPasswordToken: String
        resetPasswordExpire: String
    }

    type AuthType {
        token: String!
        userId: String!
        username: String
    }

    input CreateUserInputData {
        username: String
        password: String!
        given_name: String!
        family_name: String!
        email: String!
        group: String
        secret_key: String
    }

    type Mutation {
        createUser(userInput: CreateUserInputData): AuthType!
        login(username: String!, password: String!): AuthType!
    }
`