import OpenAI from "openai";
import fs from 'fs';
import xmlbuilder from 'xmlbuilder';
import Ftp from 'ftp';
import path from 'path';
import fse from 'fs-extra';
import { environment } from "./environment";

for (let i = 0; i < 100; i++) {
    await generateTutorial();
}

for (let i = 0; i < 100; i++) {
    await generateTutorial();
}

generateSitemap();

uploadToFtp(function () { moveFolder("backupPages", "pages"), moveFolder("generatePages", "backupPages") });

async function generateTutorial() {
    console.log("Generating tutorial...");

    let openai = new OpenAI({ apiKey: environment.apiKey });

    let question = `
    You are a helpful assistant specialized in generating detailed and SEO-friendly tutorials or manuals in HTML format. When you create a tutorial, it must be based on a totally random topic (not one of the topics listed in the user prompt). The tutorial must be **as long as possible** (Ideal length 3000 characters), clear, detailed, and formatted using HTML, with special attention to SEO basics. The tutorial should include HTML elements such as h2, h3, and other subheadings to structure the content. Keywords must be included naturally in the content. Images may also be used if appropriate.

    The tutorial must follow these guidelines:
    1. Title: The title should be relevant to the topic and not exceed 5 words.
    2. Filename: Provide a URL-friendly filename (correct name for SEO, no spaces, only lowercase and hyphens).
    3. Meta Description: Write a concise description for the meta tag (maximum 160 characters).
    4. HTML Body: The tutorial content should be wrapped in a 'div' with the class "tutorial". Avoid using the h1 element in the body. Ensure the content is informative and structured using appropriate headings (h2, h3, etc.). **Make the content as long and detailed as possible (Ideal length 3000 characters)**.
    5. Tags: Add a string array of relevant categories to which the tutorial applies (lowercase, hyphen-separated).

    Ensure the tutorial does not include any of the following tutorials: {{Tutorials}}

    And use a different topic than this: {{LastTutorial}}`;

    let userQuestion = `Please create a **long, detailed** and SEO-friendly tutorial on a random topic (avoid the topics listed above). Format the tutorial in HTML and include all the required elements. The tutorial should contain the following:
    - A relevant title (maximum 5 words).
    - Please do not use an adjective or verb as the first word in the title. Don't use as the first word - 'Understanding', 'Essential', 'Mastering'. It may contain how-to, but it doesn't have to!
    - A filename for the tutorial (URL-friendly, lowercase, with hyphens).
    - A meta description (for SEO, maximum 160 characters).
    - Structured content with h2, h3, and other subheadings as needed.
    - Ensure the content is clear, detailed, and includes keywords naturally.
    - **Make the content as long as possible** and as comprehensive as possible (Ideal length 3000 characters).
    - Tags should be relevant to the topic (lowercase, hyphen-separated).
    - The content should be wrapped in a 'div' with the class "tutorial", and should not include the name of the topic or h1 tag.
    - Optional: Include images if applicable..

    **The result must be valid JSON** with the following keys:
    - 'title': Topic title.
    - 'file': Filename (URL-friendly).
    - 'description': Meta description.
    - 'body': HTML content. **Ideal length 3000 characters**
    - 'tags': Array of categories/tags related to the topic. `;

    let tutorialsText = "";
    let lastTutorial = "";

    try {
        console.log("Reading used tutorials...");
        let data = fs.readFileSync('tutorials.txt', 'utf8');

        let tutorials = [];

        data.split('\r\n').filter(x => x).forEach(tutorial => {
            var tutorialJson = JSON.parse(tutorial);
            tutorials.push(tutorialJson);
        });

        tutorialsText = tutorials.join(', ');
        tutorialsText = tutorials.map(tutorial => tutorial.title).join(', ');
        lastTutorial = tutorials[tutorials.length - 1];

        question = question.replaceAll('{{Tutorials}}', tutorialsText);
        question = question.replaceAll('{{LastTutorial}}', lastTutorial.title);

        console.log("Requesting openai tutorial generation...");
        let completion = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                { role: "system", content: question },
                {
                    role: "user",
                    content: userQuestion,
                },
            ],
        });

        let jsonResult = completion.choices[0].message.content;

        console.log("Cleaning JSON result...");
        let result = JSON.parse(cleanJsonString(jsonResult));

        console.log("Generation '" + result.title + "' tutorial...");
        tutorials.push({ title: result.title, file: result.file });

        let fileTutorials = "";

        tutorials.forEach(tutorial => {
            fileTutorials += JSON.stringify(tutorial) + "\r\n";
        });

        console.log("Saved new tutorial to file...");
        fs.writeFileSync("tutorials.txt", fileTutorials, 'utf8');

        let tags = result.tags.map(tag => `#${tag}`).join(' ');

        console.log("Creating folder...");

        let generateFolderPath = "generatePages/" + result.file;

        if (!fs.existsSync(generateFolderPath)) {
            fs.mkdirSync(generateFolderPath, { recursive: true })
        }

        console.log("Read template...");
        let template = fs.readFileSync('template.html', 'utf8');

        template = template.replaceAll('{{Description}}', result.description);
        template = template.replaceAll('{{Title}}', result.title);
        template = template.replaceAll('{{Content}}', result.body);
        template = template.replaceAll('{{Tags}}', tags);
        template = template.replaceAll('{{PreviousLink}}', lastTutorial.file);

        console.log("Create file...");
        fs.writeFileSync(generateFolderPath + "/index.html", template, 'utf8');

        console.log("Tutorial generated!");
    } catch (err) {
        console.error(err);
    }
}



function cleanJsonString(jsonString) {
    const pattern = /^```json\s*(.*?)\s*```$/s;
    const cleanedString = jsonString.replace(pattern, '$1');
    return cleanedString.trim();
}

function generateSitemap() {
    console.log("Generating sitemap...");

    console.log("Reading used tutorials...");
    let data = fs.readFileSync('tutorials.txt', 'utf8');

    const today = new Date().toISOString().split('T')[0];

    var urlset = xmlbuilder.create('urlset').att('xmlns', 'http://www.sitemaps.org/schemas/sitemap/0.9');

    urlset.ele('url')
        .ele('loc', 'https://www.tutorial-expert.com').up()
        .ele('lastmod', today).up()
        .ele('changefreq', 'daily').up()
        .ele('priority', '1.0').up();

    urlset.ele('url')
        .ele('loc', 'https://www.tutorial-expert.com/privacy-policy').up()
        .ele('lastmod', today).up()
        .ele('changefreq', 'daily').up()
        .ele('priority', '0.9').up();

    urlset.ele('url')
        .ele('loc', 'https://www.tutorial-expert.com/terms-of-use').up()
        .ele('lastmod', today).up()
        .ele('changefreq', 'daily').up()
        .ele('priority', '0.9').up();

    urlset.ele('url')
        .ele('loc', 'https://www.tutorial-expert.com/more-tutorials').up()
        .ele('lastmod', today).up()
        .ele('changefreq', 'daily').up()
        .ele('priority', '0.9').up();

    data.split('\r\n').filter(x => x).forEach(tutorial => {
        var tutorialJson = JSON.parse(tutorial);
        urlset.ele('url')
            .ele('loc', `https://www.tutorial-expert.com/${tutorialJson.file}`).up()
            .ele('lastmod', today).up()
            .ele('changefreq', 'daily').up()
            .ele('priority', '1.0').up();
    });

    const xmlString = urlset.end({ pretty: true });

    fs.writeFileSync('sitemap.xml', xmlString);

    console.log("Generating sitemap finished");
}

function uploadToFtp(...callbacks) {
    console.log("Uploading to FTP...");

    const ftpClient = new Ftp();

    ftpClient.on('ready', function () {
        console.log("Uploading static files...");
        uploadFileToFtp(ftpClient, "ads.txt");
        uploadFileToFtp(ftpClient, "adsense.js");
        uploadFileToFtp(ftpClient, "adsense.min.js");
        uploadFileToFtp(ftpClient, "index.html");
        uploadFileToFtp(ftpClient, "index-style.css");
        uploadFileToFtp(ftpClient, "index-style.min.css");
        uploadFileToFtp(ftpClient, "logo.ico");
        uploadFileToFtp(ftpClient, "sitemap.xml");
        uploadFileToFtp(ftpClient, "style.css");
        uploadFileToFtp(ftpClient, "style.min.css");
        uploadFileToFtp(ftpClient, "tutorials.js");
        uploadFileToFtp(ftpClient, "tutorials.txt");
        uploadFileToFtp(ftpClient, "tutorials.min.js");
        uploadFileToFtp(ftpClient, "web.config");
        uploadFileToFtp(ftpClient, "cookies/cookies.css");
        uploadFileToFtp(ftpClient, "cookies/cookies.min.css");
        uploadFileToFtp(ftpClient, "cookies/cookies.js");
        uploadFileToFtp(ftpClient, "cookies/cookies.min.js");
        uploadFileToFtp(ftpClient, "more-tutorials/index.html");
        uploadFileToFtp(ftpClient, "privacy-policy/index.html");
        uploadFileToFtp(ftpClient, "terms-of-use/index.html");

        console.log("Uploading tutorials...");
        // fs.readdirSync('generatePages/', function (err, folders) {
        //     folders.forEach(function (folder) {
        //         console.log("Uploading folder: " + folder);
        //         uploadFolderWithFileToFtp(ftpClient, `${folder}/index.html`, `generatePages/${folder}/index.html`);
        //     });
        // });
        let tutorials = fs.readdirSync('generatePages/');

        tutorials.forEach(function (folder) {
            console.log("Uploading folder: " + folder);
            uploadFolderWithFileToFtp(ftpClient, `${folder}/index.html`, `generatePages/${folder}/index.html`);
        });

        ftpClient.end();

        ftpClient.on('end', function () {
            console.log("Execute callbacks...");
            callbacks.forEach(callback => {
                callback();
            });
        });

        console.log("Uploading to FTP finished");
    });

    console.log("FTP connecting...");

    ftpClient.connect({
        'host': 'd115wh.forpsi.com',
        'user': 'tutorial_expertcom',
        'password': 'qKcshm48dH'
    });
}

function uploadFileToFtp(ftpClient, filePath) {
    const targetPath = '/www/' + filePath;

    ftpClient.put(filePath, targetPath, function (err, list) {
        if (err) throw err;
    });
}

function uploadFolderWithFileToFtp(ftpClient, filePath, sourceFilePath = null) {
    const targetPath = '/www/' + filePath;
    const targetDir = path.dirname(targetPath);

    ftpClient.mkdir(targetDir, true, function (err, list) {
        ftpClient.put(sourceFilePath ?? filePath, targetPath, function (err, list) {
            if (err) throw err;
        });
    });
}

function moveFolder(source, destination) {
    console.log("Moving folder " + source + " to " + destination);

    fse.copySync(source, destination, { overwrite: true })
    fse.emptyDirSync(source)
}