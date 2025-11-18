import { type ClientSchema, a, defineData } from '@aws-amplify/backend';

const cursorType = {
  roomId: a.string().required(),
  x: a.integer().required(),
  y: a.integer().required(),
  username: a.string().required()
}

const messageType = {
  id: a.id().required(),
  createdDate: a.datetime().required(),
  lastUpdatedDate: a.datetime().required(),
  content: a.string().required(),
  roomId: a.string().required(),
  username: a.string().required()
}

const schema = a.schema({
  Room: a.model({
    topic: a.string(),
  }),

  publishCursor: a.mutation()
    .arguments(cursorType)
    .returns(a.ref('Cursor'))
    .authorization(allow => [allow.authenticated()])
    .handler(a.handler.custom({
      entry: './publishCursor.js',
    })),

  subscribeCursor: a.subscription()
    .for(a.ref('publishCursor'))
    .arguments({ roomId: a.string(), myUsername: a.string() })
    .authorization(allow => [allow.authenticated()])
    .handler(a.handler.custom({
      entry: './subscribeCursor.js'
    })),

  publishMessage: a.mutation()
    .arguments(messageType)
    .returns(a.ref('Message'))
    .authorization(allow => [allow.authenticated()])
    .handler(a.handler.custom({
      entry: './publishMessage.js',
    })),

  subscribeMessage: a.subscription()
    .for(a.ref('publishMessage'))
    .arguments({ roomId: a.string(), myUsername: a.string() })
    .authorization(allow => [allow.authenticated()])
    .handler(a.handler.custom({
      entry: './subscribeMessage.js'
    })),

  Cursor: a.customType(cursorType),
  Message: a.model(messageType)

}).authorization((allow) => [allow.authenticated()]);

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: 'userPool',
  },
});