const fs = require('fs');
const cheerio = require('cheerio');

const html = fs.readFileSync('../../cityedge-frontend/index.html', 'utf8');
const $ = cheerio.load(html);

const anims = [];
$('[data-settings*="animation"], [data-settings*="_animation"]').each((i, el) => {
    try {
        const settings = JSON.parse($(el).attr('data-settings') || '{}');
        const anim = settings.animation || settings._animation;
        if (anim) {
            anims.push({
                id: $(el).attr('data-id'),
                animation: anim
            });
        }
    } catch(e) {}
});

console.log(JSON.stringify(anims, null, 2));
