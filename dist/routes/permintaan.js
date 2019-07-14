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
const mongodb_1 = require("mongodb");
const drow_1 = require("../services/drow");
const ROUTE_PREFIX = "/permintaan";
function default_1(server, opts, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const collection = server.mongo.db.collection("permintaan");
        server.get(`/permintaan-kategori`, (request, reply) => __awaiter(this, void 0, void 0, function* () {
            const dataset = request.query.dataset;
            const result = yield collection.find({
                dataset
            });
            const items = yield result.toArray();
            const converted = items.map(it => (Object.assign({}, it, { kategori: drow_1.kategori(it) })));
            reply.send(converted);
        }));
        server.get(`${ROUTE_PREFIX}`, (request, reply) => __awaiter(this, void 0, void 0, function* () {
            const dataset = request.query.dataset;
            const result = yield collection.find({
                dataset
            });
            const items = yield result.toArray();
            reply.send(items);
        }));
        server.get(`${ROUTE_PREFIX}/:id`, (request, reply) => __awaiter(this, void 0, void 0, function* () {
            const id = request.params.id;
            const result = yield collection.findOne({
                _id: new mongodb_1.ObjectID(id)
            });
            reply.send(result);
        }));
        server.post(ROUTE_PREFIX, (request, reply) => __awaiter(this, void 0, void 0, function* () {
            const payload = request.body;
            const result = yield collection.insertOne(payload);
            reply.send(result.insertedId);
        }));
        server.put(`${ROUTE_PREFIX}/:id`, (request, reply) => __awaiter(this, void 0, void 0, function* () {
            const id = request.params.id;
            const payload = request.body;
            delete payload._id;
            const result = yield collection.findOneAndUpdate({ _id: new mongodb_1.ObjectID(id) }, { $set: Object.assign({}, payload) });
            reply.send(result.value);
        }));
        server.delete(`${ROUTE_PREFIX}/:id`, (request, reply) => __awaiter(this, void 0, void 0, function* () {
            const id = request.params.id;
            const result = yield collection.findOneAndDelete({
                _id: new mongodb_1.ObjectID(id)
            });
            reply.send(result.ok);
        }));
        server.delete(`/dataset/:dataset`, (request, reply) => __awaiter(this, void 0, void 0, function* () {
            const dataset = request.params.dataset;
            const result = yield collection.deleteMany({
                dataset
            });
            reply.send(result.deletedCount);
        }));
    });
}
exports.default = default_1;
//# sourceMappingURL=permintaan.js.map