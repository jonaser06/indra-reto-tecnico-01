FROM node:18-alpine3.18

ARG AWS_ACCESS_KEY_ID
ARG AWS_SECRET_ACCESS_KEY
ARG AWS_SESSION_TOKEN

RUN apk update
RUN apk upgrade

RUN yarn global add serverless

RUN serverless config credentials --provider aws --key ${AWS_ACCESS_KEY_ID} --secret ${AWS_SECRET_ACCESS_KEY}
RUN echo "aws_session_token=${AWS_SESSION_TOKEN}" >> ~/.aws/credentials

COPY ./scripts/init.sh /scripts/init.sh

WORKDIR /scripts
CMD [ "sh", "./init.sh" ]
