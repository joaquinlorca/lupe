const { isConfirmation } = require('../src/detector');

const confirmations = [
  'alimentada',
  'ya le di',
  'yo le di',
  'listo',
  'ya comió',
  'ya comio',
  'le di',
  'ya está',
  'ya esta',
  'dada',
  'comió',
  'comio',
  'ya',
  'YA LE DI',
  'Listo!',
  'Ya la alimenté',
  'ya la alimentamos',
];

const nonConfirmations = [
  'hola',
  'buenas noches',
  'no ya lo sé que se me olvidó',
  'oye ya me dijeron que no pueden',
  'mañana ya lo hacemos',
  'ok',
  '',
];

test.each(confirmations)('"%s" is a confirmation', (text) => {
  expect(isConfirmation(text)).toBe(true);
});

test.each(nonConfirmations)('"%s" is NOT a confirmation', (text) => {
  expect(isConfirmation(text)).toBe(false);
});
