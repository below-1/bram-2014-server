const MAX_ID = 99999999
const MIN_ID = 1

export function create (doc) {
  const fid = Math.random() * (MAX_ID - MIN_ID) + MIN_ID
  const intId = Math.floor(fid)
  const _id = `${intId}`

  return {
    _id,
    ...doc
  }
}

function inRange (x, low, high) {
  return (x >= low && x <= high)
}

function buildIntervalClass (intervals) {
  return function (x) {
    for (let i = 0; i < intervals.length; i++) {
      if (inRange(x, intervals[i][0], intervals[i][1])) {
        return i + 1
      }
    }
    // If there is no matching kategori return the first.
    return 1;
  }
}

const bsKategoriInterval = buildIntervalClass([
  [325000, 4259999],
  [4260000, 8149999],
  [8195000, 12129999],
  [12130000, 16064999],
  [16065999, 19990000]
])

const bpKategoriInterval = buildIntervalClass([
  [1000000, 12799999],
  [12800000, 24599998],
  [24599999, 36399998],
  [36399999, 48199998],
  [48199999, 59999998]
])

const jwpKategoriInterval = buildIntervalClass([
  [1, 12],
  [13, 24],
  [25, 10000]
])

export function kategori (doc) {
  let kategori = {
    jk: doc.jk,
    BS: bsKategoriInterval(doc.BS),
    BP: bpKategoriInterval(doc.BP),
    JWP: jwpKategoriInterval(doc.JWP),
    JB: doc.JB
  }
  return kategori
}

export function thousand(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

export function format (doc) {
  let result = {
    _id: doc._id,
    _rev: doc._rev,
    nama: doc.nama,
    jk: doc.jk === 1 ? 'Laki - Laki' : 'Perempuan',
    BS: 'Rp, ' + thousand(doc.BS),
    BP: 'Rp, ' + thousand(doc.BP),
    JWP: doc.JWP + ' Bulan',
    JB: doc.JB + '%',
    keterangan: doc.keterangan === 1 ? 'Lancar' : 'Macet'
  }
  return result
}

export function fromJsonV1 (d: any) {
  let result: any = {
    nama: d.nama
  }
  if (d.jk === 'L') {
    result.jk = 1
  } else {
    result.jk = 0
  }

  if (d.JB === '1 persen') {
    result.JB = 1
  } else {
    result.JB = 3
  }

  const reexp = new RegExp(',', 'g')
  const comma_ = s => (typeof s) === 'string' && s.replace(reexp, '')

  if (comma_(d.BS)) {
    result.BS = parseInt(comma_(d.BS))
  } else {
    result.BS = d.BS
  }

  if (comma_(d.BP)) {
    result.BP = parseInt(comma_(d.BP))
  } else {
    result.BP = d.BP
  }

  if (d.keterangan === 'Lancar') {
    result.keterangan = 1
  } else {
    result.keterangan = 0
  }

  result.JWP = parseInt(d.JWP.split(' ')[0])
  return result
}
