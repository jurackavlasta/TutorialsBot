// const fs = require('fs');
// const cheerio = require('cheerio');
import fs from 'fs';
import * as cheerio from 'cheerio';

fs.readdir('./pages/', function (err, folders) {
    folders.forEach(function (folder) {
        if (folder != "node_modules") {
            fs.readFile(`../pages/${folder}/index.html`, 'utf-8', (err, data) => {

                if (err) {
                    console.error('Chyba při čtení souboru:', err);
                    return;
                }

                const $ = cheerio.load(data);

                const h1Text = $('h1').text();

                console.log(`{"title":"${h1Text}", "file":"${folder}"}`);
            });
        }
    });
});