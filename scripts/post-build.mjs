import fs, { existsSync, mkdirSync } from 'fs';

const SUPPORTED_LANGS = ['cs', 'de', 'en', 'es', 'fi', 'fr', 'it', 'pl'];

const buildPath = ({ lang, ssrPath, domainPath }) => {
    let html = fs.readFileSync(`./dist/index.html`, 'utf-8');
    
    // It is twice because at some point root will be using en, but now it uses and this will just work
    html = html.replace('lang="en"', `lang="${lang}"`);

    const langHead = fs.readFileSync(`./public-ssr/${ssrPath}/head.html`, 'utf-8');
    html = html.replace(/(<!-- langHead -->).*(<!-- .langHead -->)/gsm, langHead);

    html = html.replace('<!-- srcPath -->', `<meta name="diffle-srr" content="${ssrPath}" />`);

    const noJsContent = fs.readFileSync(`./public-ssr/${ssrPath}/noJsContent.html`, 'utf-8');
    html = html.replace(/(<!-- langNoJsContent -->).*(<!-- .langNoJsContent -->)/gsm, noJsContent);
    
    fs.writeFileSync(`./dist/${domainPath}.html`, html);
}

SUPPORTED_LANGS.forEach((lang) => {
    buildPath({ lang, ssrPath: lang, domainPath: lang });
});

buildPath({ lang: 'en', ssrPath: '404', domainPath: '404' });

if (!existsSync('./dist/fi')){
    mkdirSync('./dist/fi');
}

buildPath({ lang: 'en', ssrPath: '404', domainPath: 'fi/404' });
