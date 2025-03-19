const express = require('express');
const bodyParser = require('body-parser');
const xml2js = require('xml2js');
const axios = require('axios')
const dotenv = require('dotenv')
const app = express();
const { PrismaClient } = require('@prisma/client')


dotenv.config();
app.use(express.json());
app.use(bodyParser.text({ type: 'application/atom+xml' }));


const CHANNEL_ID = process.env.CHANNEL_ID
const GOOGLE_CLOUD_YOUTUBE_API = process.env.GOOGLE_CLOUD_YOUTUBE_API
const prisma = new PrismaClient();


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

        if (data.feed && data.feed.entry){
            const videoId = data.feed.entry[0].id[0].split(':').pop();
            const title = data.feed.entry[0].title[0];
            console.log({
                Title : title,
                Link : `https://www.youtube.com/watch?v=${videoId}`
            })

            fetchLatestVideos()
        }
    } 
    catch(error){
        console.error('Error parsing webhook:', error);
    }

    res.status(200).send('OK');
});


async function fetchLatestVideos(){

    try{
        const response = await axios.get(`https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${CHANNEL_ID}&order=date&type=video&key=${GOOGLE_CLOUD_YOUTUBE_API}&maxResults=50`)

        if(response){

            console.log(response.data.nextPageToken)
            const data = response.data.items
            const data2 = []

            data.map((item)=>{
                data2.push({
                    videoURL : `https://www.youtube.com/watch?v=${item.id.videoId}`,
                    contestId : formatTitle(item.snippet.title)
                })
            })

            console.log(data2)

            const uploadData =await prisma.video.createMany({
                data : data2,
                skipDuplicates : true
            })

            console.log(`No. of video uploaded : ${uploadData.count}`)
        }
    }
    catch(e){
        console.log("server error")
    }
}

function formatTitle(title) {
    const patterns = [
        /(Codechef Starters \d+)/,
        /(Educational Codeforces Round \d+)/,
        /(Codeforces Round \d+ \(Div ?\.? ?\d+\))/,
    ];

    for (const pattern of patterns) {
        const match = title.match(pattern);
        if (match) {
            return match[0].replace(/Div ?(\d+)/, "Div. $1");
        }
    }

    return title;
}

const PORT = process.env.PORT || 3002;
app.listen(PORT, () => console.log(`Webhook running on port ${PORT}`));
