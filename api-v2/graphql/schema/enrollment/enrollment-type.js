const gql = require('graphql-tag')

module.exports = gql`
    type EnrollmentType {
        _id: ID
        class: ClassInfoType
        student: StudentType
        score: Float
        grade: String
        grade_value: Float
        isGrading: Boolean
    }

    input GradeInputData {
        studentId: ID!
        class: ID!
        score: Float!
        grade: String!
        program: String
        given_name: String
        family_name: String
    }

    type CountStudentType {
        batch: String
        course: String
        total: Int
        students: [RegisteredStudents]
    }

    type RegisteredStudents {
        course: ID
        sid: String
        grade: String
        grade_value: Float
        trimester: String
        isGrading: Boolean
    }

    type Query {
        countStudent(course_code: String!, batch: String!): CountStudentType
    }

    type Mutation {
        uploadGrade(gradeInput: GradeInputData!): MessageType
        uploadUrl(url: String!): MessageType
        calculateGrade(sid: String!): StudentType
    }
`