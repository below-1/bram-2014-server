"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class GaussNB {
    constructor() {
        this.d = undefined;
        this.n = undefined;
        this.means = new Map();
        this.variances = new Map();
        this.classProbs = new Map();
    }
    fit(Xs, Ys) {
        if (Xs.length == 0) {
            throw new Error("Empty matrix");
        }
        if (Xs.length != Ys.length) {
            throw new Error("Input and output not match");
        }
        this.n = Xs.length;
        let colSum = new Map();
        let classCount = new Map();
        for (let i = 0; i < this.n; i++) {
            let row = Xs[i];
            let _class = Ys[i];
            // If this is the first pass.
            if (i == 0) {
                // record the dimension
                this.d = row.length;
            }
            // Initialize current sumation of each attributes
            // For current class if it's not exists yet.
            if (!colSum.has(_class)) {
                colSum.set(_class, Array(this.d).fill(0));
            }
            // Initialize counter for current class if it's not exists yet.
            if (!classCount.has(_class)) {
                classCount.set(_class, 0);
            }
            // Increment counter for current class.
            classCount.set(_class, classCount.get(_class) + 1);
            // Aggregate sum for each attribute in current class.
            let classColSum = colSum.get(_class);
            for (let idx_d = 0; idx_d < this.d; idx_d++) {
                classColSum[idx_d] += row[idx_d];
            }
        }
        const uniqueClass = Array.from(colSum.keys());
        // After we get total sum of each attributes
        // Initialize means first.
        for (let _class of uniqueClass) {
            let _means = Array(this.d).fill(0);
            for (let idx_d = 0; idx_d < this.d; idx_d++) {
                _means[idx_d] = colSum.get(_class)[idx_d] * 1.0 / classCount.get(_class);
            }
            this.means[_class] = _means;
        }
        // Initialize the variances.s
        let tempSumVariances = new Map();
        for (let i = 0; i < this.n; i++) {
            let row = Xs[i];
            let _class = Ys[i];
            if (!tempSumVariances.has(_class)) {
                tempSumVariances.set(_class, Array(this.d).fill(0));
            }
            for (let idx_d = 0; idx_d < this.d; idx_d++) {
                let tmp_mean = this.means[_class][idx_d];
                let d_val = row[idx_d];
                let tmp_var = (tmp_mean - d_val) ** 2;
                tempSumVariances.get(_class)[idx_d] += tmp_var;
            }
        }
        for (let _class of uniqueClass) {
            let class_variance = tempSumVariances.get(_class).map((totalVar, idx_d) => totalVar / classCount.get(_class));
            this.variances.set(_class, class_variance);
        }
    }
    static normalize(M) {
        if (M.length === 0) {
            throw new Error(`Matrix is empty`);
        }
        const n = M.length;
        let d = undefined;
        let maxes = undefined;
        let mins = undefined;
        for (let i = 0; i < n; i++) {
            let x = M[i];
            // On first pass, initialize dimension.
            if (i == 0) {
                d = x.length;
                // Initialize maxes and mins for each dimension.
                maxes = Array(d).fill(Number.MIN_VALUE);
                mins = Array(d).fill(Number.MAX_VALUE);
            }
            if (x.length != d) {
                throw new Error(`Dimension differ: index=${i}, data=${x}`);
            }
            for (let idx_d = 0; idx_d < d; idx_d++) {
                if (x[idx_d] > maxes[idx_d]) {
                    maxes[idx_d] = x[idx_d];
                }
                if (x[idx_d] < mins[idx_d]) {
                    mins[idx_d] = x[idx_d];
                }
            }
        }
        return M.map(row => {
            return row.map((x_i, i) => {
                return (x_i + mins[i]) * 1.0 / maxes[i];
            });
        });
    }
}
exports.GaussNB = GaussNB;
//# sourceMappingURL=GaussNB.js.map