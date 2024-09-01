const replacements = {
  á: 'a',
  à: 'a',
  â: 'a',
  ä: 'a',
  ã: 'a',
  å: 'aa',
  æ: 'ae',
  ą: 'a',
  č: 'c',
  ç: 'c',
  ć: 'c',
  ð: 'd',
  đ: 'dj',
  é: 'e',
  è: 'e',
  ê: 'e',
  ě: 'e',
  ë: 'e',
  ę: 'e',
  í: 'i',
  ì: 'i',
  î: 'i',
  ï: 'i',
  ł: 'l',
  ň: 'n',
  ñ: 'n',
  ń: 'n',
  ò: 'o',
  ô: 'o',
  ö: 'o',
  ő: 'o',
  õ: 'o',
  ø: 'oe',
  œ: 'oe',
  ó: 'o',
  ř: 'r',
  š: 's',
  ß: 'ss',
  ś: 's',
  ť: 't',
  ú: 'u',
  ù: 'u',
  û: 'u',
  ů: 'u',
  ü: 'u',
  ű: 'u',
  ý: 'y',
  ÿ: 'y',
  ž: 'z',
  ź: 'z',
  ż: 'z',
  þ: 'th',
};

export const createUrlKey = (name: string) =>
  name
    .toLowerCase()
    .replace(
      /[áàâäãåæąčçćðđéèêěëęíìîïłňñńòôöőõøœóřšßśťúùûůüűýÿžźżþ]/g,
      (match) => replacements[match],
    )
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-');

export const checkSKU = (sku: string, list: string[]) => {
  if (list.includes(sku)) {
    const new_sku = createSKU(6);
    return checkSKU(new_sku, list);
  }
  return sku;
};

export const createSKU = (length: number) => {
  let result = '';
  for (let i = 0; i <= length; i++) {
    result += Math.floor(Math.random() * 10);
  }
  return result;
};
