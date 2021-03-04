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

    input UserInputData {
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

    type Query {
        user: UserType!
    }

    type Mutation {
        updateProfile(userInput: UserInputData): UserType!
    }
`