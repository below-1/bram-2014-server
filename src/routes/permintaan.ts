import { ObjectID } from "mongodb";
import { FastifyInstance } from "fastify";
import { Permintaan } from "@/models/Permintaan";

const ROUTE_PREFIX = "/permintaan";

export default async function (server: FastifyInstance, opts, next) {

  const collection = server.mongo.db.collection<Permintaan>("permintaan");

  server.get(`${ROUTE_PREFIX}`, async (request, reply) => {
    const dataset = request.query.dataset;
    const result = await collection.find({
      dataset
    });
    const items = await result.toArray();
    reply.send(items);
  });

  server.get(`${ROUTE_PREFIX}/:id`, async (request, reply) => {
    const id = request.params.id;
    const result = await collection.findOne({
      _id: new ObjectID(id)
    });
    reply.send(result);
  });

  server.post(ROUTE_PREFIX, async (request, reply) => {
    const payload = request.body;
    const result = await collection.insertOne(payload);
    reply.send(result.insertedId);
  });

  server.put(`${ROUTE_PREFIX}/:id`, async (request, reply) => {
    const id = request.params.id;
    const payload = request.body;
    delete payload._id;
    const result = await collection.findOneAndUpdate(
      { _id: new ObjectID(id) }, 
      { $set: { ...payload } });
    reply.send(result.value);
  });

  server.delete(`${ROUTE_PREFIX}/:id`, async (request, reply) => {
    const id = request.params.id;
    const result = await collection.findOneAndDelete({
      _id: new ObjectID(id)
    });
    reply.send(result.ok);
  });

  server.delete(`/dataset/:dataset`, async (request, reply) => {
    const dataset = request.params.dataset;
    const result = await collection.deleteMany({
      dataset
    });
    reply.send(result.deletedCount);
  });
 
}