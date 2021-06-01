const gql = require('graphql-tag')

module.exports = gql`
    type StudentType {
        _id: ID
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
        advisor: InstructorType
        remarks: [RemarkResultInfoType]
        status: StatusType
        taken_courses: [EnrollmentType]
        records: RecordsType
    }

    type RecordsType {
        egci_cumulative_gpa: String
        core_credits: Int
        major_credits: Int
        elective_credits: Int
        total_credits: Int
    }

    type StatusType {
        current: String
    }

    type StudentResultType {
        total: Int!
        students: [StudentType]!
    }

    type TotalBatchesType {
        total: Int!
        batches: [String]!
    }

    input StudentInputData {
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
        status: StatusInput
        advisor_name: String
    }

    input StatusInput {
        current: String
    }

    input SearchOptions {
        _id: ID
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
        advisor: ID
    }

    input BroadcastOptions {
        sid: String
        program: String
        entry_trimester: String
        entry_year: String
        batch: String
        advisor: ID
    }

    input appointmentOptions {
        image: String
        url: String
        title: String
        message: String
        date: String
        place: String
    }

    type Query {
        students(searchInput: SearchOptions, sortBy: String): StudentResultType!
        student(searchInput: SearchOptions!): StudentType!
        batches: TotalBatchesType!
    }

    type Mutation {
        addStudent(studentInput: StudentInputData!): StudentType!
        updateStudent(searchInput: SearchOptions!, studentInput: StudentInputData!): StudentType!
        deleteStudent(searchInput: SearchOptions!): MessageType!
        sendAppointment(options: BroadcastOptions, appointment: appointmentOptions!): MessageType
        broadcastStudent(sid: String!, message: String): MessageType
    }
`