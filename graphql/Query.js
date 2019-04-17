import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLList,
} from 'graphql/type';
import TypeDefs from './Types';
import db from '../models';

const { Article, Comment } = TypeDefs();

export default new GraphQLObjectType({
  name: 'Query',
  description: 'This is just any ol\' query',
  fields: () => ({
    articles: {
      type: new GraphQLList(Article),
      args: {
        _id: {
          type: GraphQLString,
        },
      },
      resolve: async (root, { _id }) => {
        const articleList = await db.Article.find({ _id });
        return articleList;
      },
    },
    posts: {
      type: new GraphQLList(Comment),
      args: {
        _id: {
          type: new GraphQLList(GraphQLString),
        },
      },
      resolve: async (root, { _id }) => {
        const commentList = await db.Comment.find({ _id });
        return commentList;
      },
    },
  }),
});
