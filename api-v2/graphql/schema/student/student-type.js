const gql = require('graphql-tag')

module.exports = gql`
    type StudentType {
        _id: ID!
        sid: String!
        program: String!
        prefix: String!
        given_name: String!
        family_name: String!
        entry_trimester: String!
        entry_year: String!
        nick_name: String
        batch: String
        avatar_url: String
        email: String
        phone: String
        lineID: String
        lineUID: String
        advisor: ID
        remarks: [ID]
    }

    type MessageType {
        succes: Boolean!
        message: String!
    }

    type StudentResultType {
        total: Int!
        students: [StudentType]!
    }

    input StudentInputData {
        sid: String
        program: String
        prefix: String
        given_name: String
        family_name: String
        entry_trimester: String
        entry_year: String
        nick_name: String
        batch: String
        avatar_url: String
        email: String
        phone: String
        lineID: String
        lineUID: String
        advisor: ID
        remarks: [ID]
    }

    input SearchOptions {
        _id: String
        sid: String
        program: String
        given_name: String
        family_name: String
        entry_trimester: String
        entry_year: String
        nick_name: String
        batch: String
        email: String
        phone: String
        lineID: String
    }

    type Query {
        students(searchInput: SearchOptions): StudentResultType!
        student(searchInput: SearchOptions!): StudentType!
    }

    type Mutation {
        addStudent(studentInput: StudentInputData!): StudentType!
        updateStudent(searchInput: SearchOptions!, studentInput: StudentInputData!): StudentType!
        deleteStudent(searchInput: SearchOptions!): MessageType!
    }
`