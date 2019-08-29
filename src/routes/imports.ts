import { ObjectID } from "mongodb";
import * as csv from "csvtojson";
import { FastifyInstance } from "fastify";
import { Permintaan } from "@/models/Permintaan";
import { fromCsvRow } from "../services/converter";

import { readFile } from 'fs';
const parse = require('fast-json-parse');

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

  server.post(`/import-static`, async (request, reply) => {
    var parsed: any[] = undefined;

    function storeData() {
      collection.insertMany(parsed);
    }

    readFile("./data.json", async (err, data) => {
      if (err) {
        console.log(err);
        throw err;
      }
      parsed = parse(data).value;
      await collection.insertMany(parsed);
      reply.send(`OK. ${parsed.length} data inserted`);
    });

  });

}