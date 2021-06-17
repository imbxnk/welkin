const gql = require('graphql-tag')

module.exports = gql`
    type CourseType{
        _id: ID
        name: String
        code: String
        description: String
        credit: Int
        credit_description: CreditDescriptionType
    }

    type CreditDescriptionType {
        lecture: Int
        lab: Int
        self_study: Int
    }

    type CourseResultType{
        total: Int!
        courses: [CourseType]!
    }

    input CreditDescription {
        lecture: Int!
        lab: Int!
        self_study: Int!
    }

    input CourseInputData{
        name: String!
        code: String!
        description: String
        credit: Int!
        credit_description: CreditDescription!
    }

    input SearchOptions{
        name: String
        code: String
    }

    type Query{
        courses(searchInput: SearchOptions): CourseResultType!
        course(searchInput: SearchOptions!): CourseType!
    }

    type Mutation{
        addCourse(courseInput: CourseInputData!): CourseType!
        updateCourse(searchInput: SearchOptions!, courseInput: CourseInputData!): CourseType!
        deleteCourse(searchInput: SearchOptions!): MessageType!
    }
`