const fs = require('fs');
const path = require('path');

const TODAY = new Date().toISOString().slice(0, 10);

module.exports = function createState(filePath) {
  function load() {
    try {
      const raw = JSON.parse(fs.readFileSync(filePath, 'utf8'));
      if (raw.date !== TODAY) return { date: TODAY, morning: false, evening: false };
      return raw;
    } catch {
      return { date: TODAY, morning: false, evening: false };
    }
  }

  function save(data) {
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  }

  return {
    isFed(meal) {
      return load()[meal] === true;
    },
    markFed(meal) {
      const data = load();
      data[meal] = true;
      save(data);
    },
  };
};
