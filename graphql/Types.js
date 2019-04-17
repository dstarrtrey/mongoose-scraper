import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLList,
} from 'graphql/type';

const Comment = new GraphQLObjectType({
  name: 'Reservation',
  description: 'This is how a user knows what events he has RSVPd to.',
  fields: () => ({
    id: {
      type: GraphQLString,
      resolve(reservation) {
        return reservation.id;
      },
    },
    comment: GraphQLString,
    articleId: {
      type: GraphQLString,
    },
  }),
});

const Article = new GraphQLObjectType({
  name: 'Article',
  description: 'This is an article',
  fields: () => ({
    id: GraphQLString,
    title: GraphQLString,
    description: GraphQLString,
    link: GraphQLString,
    img: GraphQLString,
    comments: new GraphQLList(Comment),
  }),
});

export default () => ({
  Article,
  Comment,
});
