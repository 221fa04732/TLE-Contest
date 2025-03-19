const express = require('express');
const bodyParser = require('body-parser');
const xml2js = require('xml2js');

const app = express();
app.use(bodyParser.text({ type: 'application/atom+xml' }));

app.get('/youtube-webhook', (req, res) => {
    const hubChallenge = req.query['hub.challenge'];
    if (hubChallenge) {
        res.status(200).send(hubChallenge);
    } else {
        res.status(400).send('No challenge provided');
    }
});

app.post('/youtube-webhook', async (req, res) => {
    try {
        const parser = new xml2js.Parser();
        const data = await parser.parseStringPromise(req.body);

        if (data.feed && data.feed.entry) {
            const videoId = data.feed.entry[0].id[0].split(':').pop();
            const title = data.feed.entry[0].title[0];
            console.log(`🎥 New Video: ${title} - https://www.youtube.com/watch?v=${videoId}`);
        }
    } catch (error) {
        console.error('Error parsing webhook:', error);
    }

    res.status(200).send('OK');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Webhook running on port ${PORT}`));
