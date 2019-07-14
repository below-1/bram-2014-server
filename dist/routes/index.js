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
const settings_1 = require("./settings");
const permintaan_1 = require("./permintaan");
const imports_1 = require("./imports");
const summary_1 = require("./summary");
const nb_1 = require("./nb");
const testing_1 = require("./testing");
function routes(server, opts, next) {
    return __awaiter(this, void 0, void 0, function* () {
        server.register(settings_1.default);
        server.register(permintaan_1.default);
        server.register(imports_1.default);
        server.register(summary_1.default);
        server.register(nb_1.default);
        server.register(testing_1.default);
    });
}
exports.default = routes;
//# sourceMappingURL=index.js.map