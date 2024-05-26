import fs from 'fs';

const SUPPORTED_LANGS = ['cs', 'de', 'en', 'es', 'fr', 'it', 'pl'];

SUPPORTED_LANGS.forEach((lang) => {
    let html = fs.readFileSync(`./dist/index.html`, 'utf-8');
    
    // It is twice because at some point root will be using en, but now it uses and this will just work
    html = html.replace('lang="en"', `lang="${lang}"`);
    html = html.replace('lang="pl"', `lang="${lang}"`);

    const langHead = fs.readFileSync(`./public-ssr/${lang}/head.html`, 'utf-8');
    html = html.replace(/(<!-- langHead -->).*(<!-- .langHead -->)/gsm, langHead);

    const noJsContent = fs.readFileSync(`./public-ssr/${lang}/noJsContent.html`, 'utf-8');
    html = html.replace(/(<!-- langNoJsContent -->).*(<!-- .langNoJsContent -->)/gsm, noJsContent);
    
    fs.writeFileSync(`./dist/${lang}.html`, html);
});
