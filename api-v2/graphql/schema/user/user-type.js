const gql = require('graphql-tag')

module.exports = gql`
    scalar Upload

    type UserType {
        _id: String
        display_name: String
        username: String
        password: String
        given_name: String
        family_name: String
        email: String
        group: String
        linked_instructor: InstructorType
        isAdvisor: Boolean
        avatar: AvatarType
        createdAt: String
        remarks: [RemarkType]
        resetPasswordToken: String
        resetPasswordExpire: String
    }

    type UserResultType {
        total: Int!
        users: [UserType]!
    }

    type AvatarType {
        small: String
        medium: String
        large: String
    }

    type UploadAvatarType {
        success: Boolean
        message: String
        avatar: AvatarType
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
        createdAt: String
        remarks: [ID]
        resetPasswordToken: String
        resetPasswordExpire: String
    }

    input ChangePasswordInputData {
        username: String
        currentPassword: String!
        newPassword: String!
    }

    input AccountInputData {
        given_name: String
        family_name: String
        display_name: String
    }

    input UpdateUserInputData {
        username: String
        given_name: String
        family_name: String
        display_name: String
        email: String
        group: String
    }

    type Query {
        me: UserType
        users: UserResultType!
    }

    type Mutation {
        updatePassword(userInput: ChangePasswordInputData!): AuthType!
        updateAccount(username: String, userInput: UpdateUserInputData!): UserType!
        updateMyAccount(userInput: AccountInputData!): MessageType!
        updateAvatar(file: Upload!): UploadAvatarType!
        deleteAvatar: MessageType!
    }
`