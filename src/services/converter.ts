function _throw(payload: any) {
  throw new Error(JSON.stringify(payload));
}

export function fromCsvRow(row: string[], index: number) {
  let [
    _nama,
    _jk,
    _BS,
    _BP,
    _JB,
    _JWP,
    _keterangan
  ] = row;

  let jk: number;
  let _jkUpper = _jk.trim().toUpperCase();
  if (_jkUpper == 'L') {
    jk = 1;
  } else if (_jkUpper == 'P') {
    jk = 0;
  } else {
    _throw({
      message: `Can't parse Jenis Kelamin = ${_jk}. index=${index}`,
      row
    });
  }

  let BS = parseInt(_BS);
  let BP = parseInt(_BP);

  let JB: number;
  let _JBUpper = _JB.toUpperCase();
  if (_JBUpper === '1 PERSEN') {
    JB = 1
  } else if (_JBUpper == '3 PERSEN') {
    JB = 3
  } else {
    _throw({
      message: `Can't parse Jenis Bunga = ${_JB}. index=${index}`,
      row
    });
  }

  let JWP: number;
  let _JWPSplitted = _JWP.trim().split(' ');
  if (_JWPSplitted.length == 2) {
    JWP = parseInt(_JWPSplitted[0]);
  } else {
    _throw({
      message: `Can't parse Jangka Waktu Pinjman = ${_JWP}. index=${index}`,
      row
    });
  }

  let keterangan: number;
  let _keteranganUpper = _keterangan.trim().toUpperCase();
  if (_keteranganUpper == 'LANCAR') {
    keterangan = 1;
  } else if (_keteranganUpper == 'MACET') {
    keterangan = 0;
  }

  return {
    nama: _nama,
    jk,
    BS,
    BP,
    JB,
    JWP,
    keterangan
  };
}