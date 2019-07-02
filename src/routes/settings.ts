import { FastifyInstance } from "fastify";
import { AppSettings } from "@models/AppSettings";

const ROUTE_PREFIX = "/settings";

export default async function (server: FastifyInstance, opts, next) {
  const collection = server.mongo.db.collection<AppSettings>("permintaan");

  server.put(ROUTE_PREFIX, async (request, reply) => {
    const payload = request.body;
    const result = await collection.findOneAndUpdate(
      {},
      { $set: {...payload} }
    );
    reply.send(result.value);
  });

  server.get(ROUTE_PREFIX, async (request, reply) => {
    const result = await collection.findOne(
      {}
    );
    reply.send(result);
  });
  
}