// Load .env file if it exists.
require("dotenv").config();
const path = require('path')

import * as fastify from "fastify";
import * as fastifyBlipp from "fastify-blipp";
import * as fastifyMongo from "fastify-mongodb";
import * as fastifyCors from "fastify-cors";
import * as fastifyStatic from "fastify-static";
import * as fastifyFileUpload from "fastify-file-upload";
import { Server, IncomingMessage, ServerResponse } from "http";

import routes from "./routes";

const server: fastify.FastifyInstance<
  Server,
  IncomingMessage,
  ServerResponse
> = fastify();

server.register(fastifyBlipp);
server.register(fastifyCors);
server.register(fastifyStatic, {
  root: path.join(process.cwd(), 'static')
});
server.register(fastifyFileUpload);
server.register(fastifyMongo, {
  forceClose: true,
  url: process.env.MONGO_URL
});
server.register(routes, { prefix: "/api/v1" });
server.setErrorHandler((error, request, reply) => {
  throw error;
})

async function start() {
  try {
    const port = parseInt(process.env.PORT);
    await server.listen(port, "0.0.0.0");
    server.blipp();
    console.log(`server listen at port ${port}`);
  } catch (err) {
    console.log(err);
    server.log.error(err);
    process.exit();
  }
}

start();