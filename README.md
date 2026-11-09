# TutorialsBot

Jednoduchý experimentální projekt pro generování SEO článků a stránek pomocí OpenAI API. Je to spíš testovací sandbox pro práci s AI, automatickým vytvářením obsahu a publikováním statických stránek.

## Co projekt dělá

- generuje tutoriály a články přes OpenAI Chat Completions
- ukládá vytvořené názvy a soubory do `tutorials.txt`
- vytváří HTML stránku z šablony v `template.html`
- generuje `sitemap.xml`
- může nahrát výsledky na FTP server
- slouží jako ukázkový prototype pro testování AI generování obsahu a SEO struktury

## Důvod projektu

Tento projekt není produkční aplikace v klasickém smyslu. Je to zkušební a experimentální nástroj, který pomáhá:

- testovat chování AI při generování textu
- experimentovat s HTML šablonami a SEO meta tagy
- řešit automatické ukládání a publikaci článků
- zkoušet generování rozsáhlého obsahu bez složité architektury

## Technologické stack

- Node.js
- JavaScript / ES modules
- OpenAI SDK
- Express
- cheerio
- fs-extra
- xmlbuilder
- FTP knihovna

## Požadavky

- Node.js 18+
- npm
- OpenAI API key

## Instalace

1. Otevři projekt:

```bash
cd d:\Programming\TutorialsBot
```

2. Nainstaluj závislosti:

```bash
npm install
```

## Konfigurace API klíče

Projekt načítá API klíč z lokálního souboru `environment.ts`:

```ts
export const environment = {
  apiKey: 'TVUJ_OPENAI_API_KLIC'
};
```

Důležité:

- tento soubor by neměl být v repozitáři
- v projektu je už správně nastaveno v `.gitignore`
- pro bezpečné lokální používání je vhodné mít tento soubor mimo Git, například v osobní složce na disku

Příklad:

```text
C:\projekty\secrets\tutorialsbot-environment.ts
```

## Spuštění

Spusť script:

```bash
node generateTutorials.mjs
```

Ve výchozím nastavení script:

- vygeneruje několik tutoriálů
- uloží je do `generatePages/`
- vytvoří `sitemap.xml`
- pokusí se nahrát soubory na FTP

## Struktura projektu

```text
.
├── .gitignore
├── environment.ts              # lokální API konfigurace
├── generateTutorials.mjs       # hlavní generátor
├── template.html               # šablona stránky
├── tutorials.txt               # seznam vytvořených tutoriálů
├── sitemap.xml                 # vygenerovaná mapa stránek
├── generatePages/              # generované stránky
├── backupPages/                # zálohy starých stránek
├── pages/                      # aktuální publikované stránky
├── more-tutorials/
├── privacy-policy/
├── terms-of-use/
├── package.json
├── node_modules/
├── README.md
└── ...
```

## Bezpečnostní poznámky

- nikdy neukládej API klíč do veřejného repozitáře
- necommituj `environment.ts`, `.env`, ani další soubory s tajnými údaji
- pokud bude projekt rozšiřovaný, je lepší přesunout konfiguraci do environment proměnných nebo secrets manageru

## Poznámky k FTP

V `generateTutorials.mjs` je funkce `uploadToFtp()`, která nahrává výsledné soubory na vzdálený server. Pokud projekt používáš lokálně, vždy:

- ověř správné FTP přihlašovací údaje
- neukládej hesla do Gitu
- testuj upload pouze v bezpečném prostředí

## Možné rozšíření

- přesunout API klíč do `.env`
- přidat `npm run generate`
- přidat logování a retry mechanismy
- oddělit generování textu a upload do FTP
- přidat UI nebo jednoduchý dashboard pro testování výsledků AI

## Licence

Tento projekt je licencován pod licencí MIT.

```text
MIT License

Copyright (c) 2026

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```
