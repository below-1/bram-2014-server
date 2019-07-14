"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const drow_1 = require("./drow");
function baseCount3() {
    return { "1": 0, "2": 0, "3": 0 };
}
function baseCount5() {
    return { "1": 0, "2": 0, "3": 0, "4": 0, "5": 0 };
}
exports.defaultSummary = () => ({
    "0": 0,
    "1": 0,
    jk: {
        "0": {
            "0": 0,
            "1": 0
        },
        "1": {
            "0": 0,
            "1": 0
        }
    },
    BS: {
        "0": baseCount5(),
        "1": baseCount5()
    },
    BP: {
        "0": baseCount5(),
        "1": baseCount5()
    },
    JWP: {
        "0": baseCount3(),
        "1": baseCount3()
    },
    JB: {
        "0": {
            "1": 0,
            "3": 0
        },
        "1": {
            "1": 0,
            "3": 0
        }
    }
});
function summary(data) {
    let result = exports.defaultSummary();
    for (let d of data) {
        const classKey = `${d.keterangan}`;
        // console.log('classKey=', classKey)
        // console.log(d)
        const _k = drow_1.kategori(d);
        // console.log('_k=', _k)
        result[classKey] += 1;
        result['jk'][classKey][`${_k.jk}`] += 1;
        result['BS'][classKey][`${_k.BS}`] += 1;
        result['BP'][classKey][`${_k.BP}`] += 1;
        result['JWP'][classKey][`${_k.JWP}`] += 1;
        result['JB'][classKey][`${_k.JB}`] += 1;
    }
    return result;
}
exports.summary = summary;
//# sourceMappingURL=summary.js.map