const KEYWORDS = [
  'alimentada', 'ya le di', 'yo le di', 'listo', 'ya comio', 'ya comió',
  'le di', 'ya esta', 'ya está', 'dada', 'comio', 'comió', 'alimente', 'alimentamos',
];

const SHORT_KEYWORDS = ['ya'];

function normalize(text) {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[¡!¿?]/g, '')
    .trim();
}

function isConfirmation(text) {
  if (!text) return false;
  const norm = normalize(text);
  if (KEYWORDS.some((kw) => norm.includes(normalize(kw)))) return true;
  const words = norm.split(/\s+/).filter(Boolean);
  if (words.length <= 3 && SHORT_KEYWORDS.some((kw) => words.includes(kw))) return true;
  return false;
}

module.exports = { isConfirmation };
