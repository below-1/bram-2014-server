import { summary } from './summary'
import { kategori } from './drow'

export const nbSummary = () => ({
  result: 0,
  '1': {
    '_prior': 0,
    '_prob': 0,
    jk: 0,
    BS: 0,
    BP: 0,
    JWP: 0,
    JB: 0
  },
  '0': {
    '_prior': 0,
    '_prob': 0,
    jk: 0,
    BS: 0,
    BP: 0,
    JWP: 0,
    JB: 0
  }
})

export function nb (data, x) {
  const _nbSumm = nbSummary()
  const _summary = summary(data)
  const xkategori = kategori(x)

  const xjk = xkategori.jk
  const xBS = xkategori.BS
  const xBP = xkategori.BP
  const xJWP = xkategori.JWP
  const xJB = xkategori.JB

  const totalData = data.length
  const nLancar = 1.0 * _summary['1']
  const nMacet = 1.0 * _summary['0']
  console.log('nLancar=', nLancar)
  console.log('nMacet=', nMacet)
  console.log('total=', totalData)
  const lancarPrior = nLancar / totalData
  const macetPrior = nMacet / totalData

  _nbSumm['1']['_prior'] = lancarPrior
  _nbSumm['0']['_prior'] = macetPrior

  const probInClass = (attrKey, attrValue, classKey) => _summary[attrKey][classKey][`${attrValue}`] * 1.0 / _summary[classKey]
  const probInLancar = (attrKey, attrValue) => probInClass(attrKey, attrValue, '1')
  const probInMacet = (attrKey, attrValue) => probInClass(attrKey, attrValue, '0')

  // console.log('xFormat=', xkategori)
  // console.log(_summary)
  // console.log('probInLancar_jk=', probInLancar('jk', xjk))
  // console.log('probInLancar_BS=', probInLancar('BS', xBS))
  // console.log('probInLancar_BP=', probInLancar('BP', xBP))
  // console.log('probInLancar_JWP=', probInLancar('JWP', xJWP))
  // console.log('probInLancar_JB=', probInLancar('JB', xJB))
  // console.log('probInLancar_JB=', _summary['JB']['1'][`1`] * 1.0 / _summary['1'])

  const jkLancarProb = probInLancar('jk', xjk)
  const jkMacetProb = probInMacet('jk', xjk)

  const BSLancarProb = probInLancar('BS', xBS)
  const BSMacetProb = probInMacet('BS', xBS)

  const BPLancarProb = probInLancar('BP', xBP)
  const BPMacetProb = probInMacet('BP', xBP)

  const JWPLancarProb = probInLancar('JWP', xJWP)
  const JWPMacetProb = probInMacet('JWP', xJWP)

  const JBLancarProb = probInLancar('JB', xJB)
  const JBMacetProb = probInMacet('JB', xJB)

  _nbSumm['1']['jk'] = jkLancarProb
  _nbSumm['0']['jk'] = jkMacetProb

  _nbSumm['1']['BP'] = BPLancarProb
  _nbSumm['0']['BP'] = BPMacetProb

  _nbSumm['1']['BS'] = BSLancarProb
  _nbSumm['0']['BS'] = BSMacetProb

  _nbSumm['1']['JWP'] = JWPLancarProb
  _nbSumm['0']['JWP'] = JWPMacetProb

  _nbSumm['1']['JB'] = JBLancarProb
  _nbSumm['0']['JB'] = JBMacetProb

  const lancarProb = lancarPrior * jkLancarProb * BSLancarProb * BPLancarProb * JWPLancarProb * JBLancarProb
  const macetProb = macetPrior * jkMacetProb * BSMacetProb * BPMacetProb * JWPMacetProb * JBMacetProb
  // console.log('lancarProb=', lancarProb)
  // console.log('macetProb=', macetProb)

  _nbSumm['1']['_prob'] = lancarProb
  _nbSumm['0']['_prob'] = macetProb

  if (lancarProb > macetProb) {
    _nbSumm.result = 1
  } else {
    _nbSumm.result = 0
  }
  return _nbSumm
}

export function nbWithSumm(summ, x) {
  const _nbSumm = nbSummary()
  const _summary = summ
  const xkategori = kategori(x)

  const xjk = xkategori.jk
  const xBS = xkategori.BS
  const xBP = xkategori.BP
  const xJWP = xkategori.JWP
  const xJB = xkategori.JB

  const totalData = summ['1'] + summ['0']
  const nLancar = 1.0 * _summary['1']
  const nMacet = 1.0 * _summary['0']
  const lancarPrior = nLancar / totalData
  const macetPrior = nMacet / totalData

  _nbSumm['1']['_prior'] = lancarPrior
  _nbSumm['0']['_prior'] = macetPrior

  const probInClass = (attrKey, attrValue, classKey) => _summary[attrKey][classKey][`${attrValue}`] * 1.0 / _summary[classKey]
  const probInLancar = (attrKey, attrValue) => probInClass(attrKey, attrValue, '1')
  const probInMacet = (attrKey, attrValue) => probInClass(attrKey, attrValue, '0')

  // console.log('xFormat=', xkategori)
  // console.log(_summary)
  // console.log('probInLancar_jk=', probInLancar('jk', xjk))
  // console.log('probInLancar_BS=', probInLancar('BS', xBS))
  // console.log('probInLancar_BP=', probInLancar('BP', xBP))
  // console.log('probInLancar_JWP=', probInLancar('JWP', xJWP))
  // console.log('probInLancar_JB=', probInLancar('JB', xJB))
  // console.log('probInLancar_JB=', _summary['JB']['1'][`1`] * 1.0 / _summary['1'])

  const jkLancarProb = probInLancar('jk', xjk)
  const jkMacetProb = probInMacet('jk', xjk)

  const BSLancarProb = probInLancar('BS', xBS)
  const BSMacetProb = probInMacet('BS', xBS)

  const BPLancarProb = probInLancar('BP', xBP)
  const BPMacetProb = probInMacet('BP', xBP)

  const JWPLancarProb = probInLancar('JWP', xJWP)
  const JWPMacetProb = probInMacet('JWP', xJWP)

  const JBLancarProb = probInLancar('JB', xJB)
  const JBMacetProb = probInMacet('JB', xJB)

  _nbSumm['1']['jk'] = jkLancarProb
  _nbSumm['0']['jk'] = jkMacetProb

  _nbSumm['1']['BP'] = BPLancarProb
  _nbSumm['0']['BP'] = BPMacetProb

  _nbSumm['1']['BS'] = BSLancarProb
  _nbSumm['0']['BS'] = BSMacetProb

  _nbSumm['1']['JWP'] = JWPLancarProb
  _nbSumm['0']['JWP'] = JWPMacetProb

  _nbSumm['1']['JB'] = JBLancarProb
  _nbSumm['0']['JB'] = JBMacetProb

  const lancarProb = lancarPrior * jkLancarProb * BSLancarProb * BPLancarProb * JWPLancarProb * JBLancarProb
  const macetProb = macetPrior * jkMacetProb * BSMacetProb * BPMacetProb * JWPMacetProb * JBMacetProb
  // console.log('lancarProb=', lancarProb)
  // console.log('macetProb=', macetProb)

  _nbSumm['1']['_prob'] = lancarProb
  _nbSumm['0']['_prob'] = macetProb

  if (lancarProb > macetProb) {
    _nbSumm.result = 1
  } else {
    _nbSumm.result = 0
  }
  return _nbSumm
}
