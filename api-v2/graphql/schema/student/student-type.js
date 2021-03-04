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

    input SearchStudentInputData {
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
        students: [StudentType!]!
        student(searchInput: SearchStudentInputData!): StudentType!
    }

    type Mutation {
        addStudent(studentInput: StudentInputData!): StudentType!
        updateStudent(searchInput: SearchStudentInputData!, studentInput: StudentInputData!): StudentType!
    }
`