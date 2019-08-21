import { ObjectID } from "mongodb";
import { FastifyInstance } from "fastify";
import { partition, testing, accuracy, precision, recall, miscRate, testingAndChange } from "../services/testing";
import { Permintaan } from "@/models/Permintaan";

const ROUTE_PREFIX = "/testing";

export default async function (server: FastifyInstance, opts, next) {

  const collection = server.mongo.db.collection<Permintaan>("permintaan");

  const changeFunc = async (id, keterangan) => {
    await collection.findOneAndUpdate(
      { _id: new ObjectID(id) }, 
      { $set: {
        keterangan
      } });
  };

  server.post("/testing", async (request, reply) => {

    const k = parseInt(request.body.k);
    const dataset = request.body.dataset;

    const findResult = await collection.find({
      dataset
    });
    const items = await findResult.toArray();

    const parts = partition(items, k)

    const promResults = parts.map(async (part, idx) => {
      let trainingData = parts.filter((p, pidx) => pidx !== idx)
      trainingData = trainingData.reduce((a, b) => a.concat(b), [])
      const partResult = testing(trainingData, part);
      return partResult;
    });

    const results = await Promise.all(promResults);

    reply.send(results);
  });

  server.post("/testing-with-change", async (request, reply) => {

    const k = parseInt(request.body.k);
    const dataset = request.body.dataset;

    const findResult = await collection.find({
      dataset
    });
    const items = await findResult.toArray();

    const parts = partition(items, k)

    const results = parts.map(async (part, idx) => {
      let trainingData = parts.filter((p, pidx) => pidx !== idx)
      trainingData = trainingData.reduce((a, b) => a.concat(b), [])

      let partResult = testing(trainingData, part);
      if (partResult.accuracy < 65) {
        await testingAndChange(trainingData, part, changeFunc);
        partResult = testing(trainingData, part);
      }
      return partResult;
    });

    reply.send(await Promise.all(results));
  });

}