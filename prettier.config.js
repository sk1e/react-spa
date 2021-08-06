const fs = require('fs');

function srcContent() {
  const groups = fs
    .readdirSync('./src')
    .map(file => {
      if (file.endsWith('.ts') || file.endsWith('.tsx')) {
        return file.split('.')[0];
      }

      return file;
    })
    .map(x => `(?:${x})`)
    .join('|');

  return `^(?:${groups})/?.*$`;
}

console.log(srcContent());

module.exports = {
  trailingComma: 'all',
  tabWidth: 2,
  printWidth: 80,
  semi: true,
  singleQuote: true,
  importOrder: [srcContent(), '^[./]'],
  importOrderSeparation: true,
  arrowParens: 'avoid',
};
