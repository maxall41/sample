# Install all node_modules and build the project
FROM node:16

ARG PLAID_CLIENT_ID PLAID_ENV PLAID_SECRET SESSION_SECRET_KEY DATABASE_URL PGDATABASE PGHOST PGPASSWORD PGPORT PGUSER
ENV PLAID_CLIENT_ID=$PLAID_CLIENT_ID PLAID_ENV=$PLAID_ENV PLAID_SECRET=$PLAID_SECRET SESSION_SECRET_KEY=$SESSION_SECRET_KEY DATABASE_URL=$DATABASE_URL PGDATABASE=$PGDATABASE PGHOST=$PGHOST PGPASSWORD=$PGPASSWORD PGPORT=$PGPORT PGUSER=$PGUSER

COPY . .
RUN yarn

RUN NODE_ENV=production yarn blitz prisma generate && yarn build && yarn migrate:deploy
EXPOSE $PORT