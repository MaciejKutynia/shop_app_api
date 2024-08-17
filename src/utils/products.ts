const polishSigns = {
  ą: 'a',
  ć: 'c',
  ę: 'e',
  ł: 'l',
  ń: 'n',
  ó: 'o',
  ś: 's',
  ź: 'z',
  ż: 'z',
};

export const createUrlKey = (name: string) =>
  name
    .toLowerCase()
    .replace(/ /g, '-')
    .replace(/[ąćęłńóśźż]/g, (match) => polishSigns[match]);

export const checkSKU = (sku: string, list: string[]) => {
  if (list.includes(sku)) {
    const newSKU = createSKU(6);
    return checkSKU(newSKU, list);
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
