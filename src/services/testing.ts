import { nb, nbWithSumm } from './nb'
import { summary } from './summary'

export function partition(data, k) {
  let parts = [...Array(k).keys()].map(i => {
    return []
  })
  data.forEach((x, idx) => {
    const partIdx = idx % k
    parts[partIdx].push(x)
  })
  return parts
}

export function testing (training, testing) {
  const summ = summary(training)
  let testingResult = {
    tp: 0,
    tn: 0,
    fp: 0,
    fn: 0
  }

  testing.forEach(x => {
    const actual = x.keterangan
    const nbResult = nbWithSumm(summ, x)
    const predicted = nbResult.result

    // TP
    if (actual === 1 && predicted === 1) {
      testingResult.tp += 1;
    // TN
    } else if (actual === 0 && predicted === 0) {
      testingResult.tn += 1;
    // FP
    } else if (actual === 0 && predicted === 1) {
      testingResult.fp += 1;
    // FN
    } else if (actual === 1 && predicted === 0) {
      testingResult.fn += 1;
    } else {
      throw new Error("What the fuck happen!");
    }
  });

  return {
    accuracy: accuracy(testingResult),
    precision: precision(testingResult),
    recall: recall(testingResult),
    miscRate: miscRate(testingResult),
    ...testingResult
  };
}

export async function testingAndChange(training, testing, changeFunc) {
  const summ = summary(training);

  for(let x of testing) {
    const actual = x.keterangan
    const nbResult = nbWithSumm(summ, x)
    const predicted = nbResult.result
    
    // Just remove the false positive
    if (actual === 0 && predicted === 1) {
      await changeFunc(x._id, 1);
    }
  }
}

export const accuracy = testR => (testR.tp + testR.tn) * 100.0 / (testR.tp + testR.tn + testR.fp + testR.fn)
export const precision = testR => testR.tp * 100.0 / (testR.tp + testR.tn)
export const recall = testR => testR.tp * 100.0 / (testR.tp + testR.fn)
export const miscRate = testR => (testR.fp + testR.fn) * 100.0 / (testR.tp + testR.tn + testR.fp + testR.fn)
