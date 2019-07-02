import { ObjectID } from "mongodb";
import * as csv from "csvtojson";
import { FastifyInstance } from "fastify";
import { Permintaan } from "@/models/Permintaan";
import { fromCsvRow } from "../services/converter";

const ROUTE_PREFIX = "/import";

export default async function (server: FastifyInstance, opts, next) {

  const collection = server.mongo.db.collection<Permintaan>("permintaan");

  server.post(`${ROUTE_PREFIX}/:dataset`, async (request, reply) => {
    const dataset = request.params.dataset;
    let raw: any = request.raw;
    let files = raw.files;
    let csvData = files.data;
    let fileContent = csvData.data.toString();
    const csvRows = await csv({
      noheader:true,
      output: "csv"
    }).fromString(fileContent);

    const items = csvRows.map(fromCsvRow);
    const itemsWithDataset = items.map(it => ({
      ...it,
      dataset
    }));
    await collection.insertMany(itemsWithDataset);
    reply.send(items.length);
  });

}