import { FastifyInstance } from "fastify";
import { Permintaan } from "@/models/Permintaan";
import { summary } from "../services/summary";

export default async function (server: FastifyInstance, opts, next) {

  const collection = server.mongo.db.collection<Permintaan>("permintaan");

  server.get("/summary/:dataset", async (request, reply) => {
    const dataset = request.params.dataset;
    let findResult = await collection.find({
      dataset
    });
    let items = await findResult.toArray();

    let result = summary(items);
    reply.send(result);
  });  

  server.get("/count/:dataset", async (request, reply) => {
    const dataset = request.params.dataset;
    const countResult = await collection.countDocuments({ dataset });
    reply.send({ count: countResult });
  });

}