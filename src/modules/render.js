const path = require('path');
const ejs = require('ejs');
const fs = require('fs');

const templatePath = path.join(__dirname, '../views/registerPage.ejs');
const template = fs.readFileSync(templatePath, 'utf8');

const html = ejs.render(template, {
  titulo: 'Register',
});

fs.writeFileSync('index.html', html);

console.log('Arquivo HTML gerado!');
