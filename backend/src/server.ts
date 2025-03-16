import express from 'express'
import cors from 'cors'
import axios from 'axios'

const app = express();
app.use(cors())
app.use(express.json())


type upcomminingContest = {
    contest_type : string
    contest_id : string
    contest_name : string
    contest_duration : string
    contest_time : string
}

type previousContest = {
    contest_type : string
    contest_id : string
    contest_name : string
    contest_time : string
}

app.get('/contest', async(req, res)=>{

    const codechefContest = await axios.get('https://www.codechef.com/api/list/contests/all?sort_by=START&sorting_order=asc&offset=0&mode=all')

    const codeforcesContest = await axios.get("https://codeforces.com/api/contest.list")

    let previousContest : previousContest[] = []
    let upcomminingContest : upcomminingContest[] =[]

    codechefContest.data.future_contests.map((contest : any)=>{
        upcomminingContest.push({
            contest_type : "codechef",
            contest_id : contest.contest_code,
            contest_name : contest.contest_name,
            contest_duration : contest.contest_duration,
            contest_time : new Date(contest.contest_start_date_iso).toLocaleString("en-IN", {
                day: "2-digit",
                month: "short",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
                hour12: true
            })
        })
    })

    codechefContest.data.past_contests.map((contest : any)=>{
        previousContest.push({
            contest_type : "codechef",
            contest_id : contest.contest_code,
            contest_name : contest.contest_name,
            contest_time : new Date(contest.contest_start_date_iso).toLocaleString("en-IN", {
                day: "2-digit",
                month: "short",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
                hour12: true
            })
        })
    })

    codeforcesContest.data.result.map((contest : any)=>{
        if(contest.phase === "BEFORE"){
            upcomminingContest.push({
                contest_type : "codeforces",
                contest_id : contest.id,
                contest_name : contest.name,
                contest_duration : contest.durationSeconds,
                contest_time : new Date(contest.startTimeSeconds*1000).toLocaleString("en-IN",{
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: true
                })
            })
        }

        else if(contest.phase === "FINISHED"){
            previousContest.push({
                contest_type : "codeforces",
                contest_id : contest.id,
                contest_name : contest.name,
                contest_time : new Date(contest.startTimeSeconds*1000).toLocaleString("en-IN",{
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: true
                })
            })
        }
    })

    res.status(200).json({

        upcomminingContest : upcomminingContest.sort((a, b)=> new Date(a.contest_time).getTime() - new Date(b.contest_time).getTime()),

        previousContest : previousContest.sort((a, b)=> new Date(a.contest_time).getTime()- new Date(b.contest_time).getTime()).reverse()
    })

})

app.listen(3000, ()=>{
    console.log('server is listining')
})