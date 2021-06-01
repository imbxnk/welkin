const gql = require('graphql-tag')

module.exports = gql`
    type CurriculumType{
        _id: ID
        name: String
        batches: [String]
        courses: [CourseType]
        passing_conditions: PassingCreditsType
    }

    type MessageType {
        success: Boolean!
        message: String!
        duplicate_items: [String]
    }

    type CurriculumResultType{
        total: Int!
        curriculums: [CurriculumType]!
    }
    
    type PassingCreditsType {
        core_courses: Int
        required_courses: Int
        elective_courses: Int
    }

    input CurriculumInputData{
        name: String!
        batches: [String]!
        courses: [ID]
        passing_conditions: PassingCreditsInput!
    }
    
    input SearchOptions{
        name: String
        batches: String
        courses: String
        curriculumId: ID
    }

    input PassingCreditsInput {
        core_courses: Int!
        required_courses: Int!
        elective_courses: Int!
    }

    type Query{
        curriculums: CurriculumResultType!
        curriculum(searchInput: SearchOptions!): CurriculumType!
    }

    type Mutation{
        addCurriculum(curriculumInput: CurriculumInputData!): CurriculumType!
        addCoursesToCurriculum(curriculumId: ID!, courseId: [ID!]!): MessageType!
        deleteCurriculum(curriculumId: ID!): MessageType!
    }
`