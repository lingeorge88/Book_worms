const { AuthenticationError } = require('apollo-server-express');
const { User } = require('../models');
const { signToken } = require('../utils/auth');

const resolvers = {
    Query: {
        me: async (parent, args, context) => {
            if(context.user) {
                // instructing the MongoDB query to exclude the __v and password fields from the result set
                const userData = await User.findOne({ _id: context.user._id}).select('-__v -password');
                return userData;
            }
            throw new AuthenticationError('You need to be logged in first!');
        },
    },

    Mutation: {
        addUser: async (parent, args) => {
            const user = await User.create(args);
            const token = signToken(user);
            return { token, user }
        },

        login: async (parent, { email, password }) => {
            const user = await User.findOne({ email });
            if(!user){
                throw new AuthenticationError('No user found with that email address, please try again');
            }

            const correctPw = await User.isCorrectPassword(password);
            if(!correctPw) {
                throw new AuthenticationError('Incorrect password, please try again');
            }
            const token = signToken(user);
            return { token, user };
        },

        saveBook: async (parent, {bookId}, context) => {
            if(context.user){
                const updatedUser = await User.findByIdAndUpdate(
                    { _id: context.user._id},
                    { $pull: {savedBooks: {bookId}}},
                    { new: true }
                );
                return updatedUser;
            }
            throw new AuthenticationError('Please log in to add or remove a book');
        },

        removeBook: async (parent, { bookId}, context) => {
            if(context.user) {
                const updatedUser = await User.findByIdAndUpdate(
                    { _id : context.user._id},
                    { $pull: {savedBooks: {bookId}}},
                    { new: true }
                );
                return updatedUser;
            }
            throw new AuthenticationError('Please log in to add or remove a book');
        },
    },
};