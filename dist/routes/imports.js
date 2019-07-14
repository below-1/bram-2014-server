"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const csv = require("csvtojson");
const converter_1 = require("../services/converter");
const ROUTE_PREFIX = "/import";
function default_1(server, opts, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const collection = server.mongo.db.collection("permintaan");
        server.post(`${ROUTE_PREFIX}/:dataset`, (request, reply) => __awaiter(this, void 0, void 0, function* () {
            const dataset = request.params.dataset;
            let raw = request.raw;
            let files = raw.files;
            let csvData = files.data;
            let fileContent = csvData.data.toString();
            const csvRows = yield csv({
                noheader: true,
                output: "csv"
            }).fromString(fileContent);
            const items = csvRows.map(converter_1.fromCsvRow);
            const itemsWithDataset = items.map(it => (Object.assign({}, it, { dataset })));
            yield collection.insertMany(itemsWithDataset);
            reply.send(items.length);
        }));
    });
}
exports.default = default_1;
//# sourceMappingURL=imports.js.map