import chalk from 'chalk'
import fs, { existsSync, mkdirSync } from 'fs';

console.log()
console.log(chalk.green("Building..."));
console.log()

let template = fs.readFileSync(`./user-scripts/hejto-parser/template.js`, 'utf-8')
const partPaths = fs.readdirSync('./user-scripts/hejto-parser/dev');

partPaths.forEach((path) => {
  const partImportInTemplate = `/* import @/${path} */`
      
  if (template.includes(partImportInTemplate)) {
    let content = fs.readFileSync(`./user-scripts/hejto-parser/dev/${path}`, 'utf8');

    // Export are removed from user-script
    content = content.replace(/export const/g, 'const');

    // Eslint comments are removed from user-scripts
    [
      '/* eslint-disable no-undef */',
  ].forEach((eslintComment) => {
    content = content.replaceAll(eslintComment, '');
  });

    template = template.replace(partImportInTemplate, content);
    console.log(` - @/${chalk.blue(path)} was imported`);;
  } else {
    if (!path.includes('test.js')){
      console.log(` - @/${chalk.blue(path)} was ${chalk.red("skipped")}`);;
    }
  }
})

console.log()
console.log(chalk.green("Saving..."));
console.log()

if (!existsSync('./dist-us')){
  mkdirSync('./dist-us');
}

fs.writeFileSync('./dist-us/hejto-parser.user.js', template);