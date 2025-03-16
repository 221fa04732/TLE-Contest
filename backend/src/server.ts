import express from 'express'
import cors from 'cors'
import axios from 'axios'
import { PrismaClient } from '@prisma/client';
import { sign } from 'jsonwebtoken'
import authMiddleware from './auth';

const app = express();
app.use(cors())
app.use(express.json())
const prisma = new PrismaClient()


type upcomminingContest = {
    contest_type : string
    contest_id : string
    contest_name : string
    contest_duration : string
    contest_time : string
    bookmarked : boolean
}

type previousContest = {
    contest_type : string
    contest_id : string
    contest_name : string
    contest_time : string
    bookmarked : boolean
    video : string
}


app.get('/contest', authMiddleware, async(req : any, res : any)=>{

    const { userId } = req.userInfo;

    const codechefContest = await axios.get('https://www.codechef.com/api/list/contests/all?sort_by=START&sorting_order=asc&offset=0&mode=all')

    const codeforcesContest = await axios.get("https://codeforces.com/api/contest.list")

    const bookmark = await prisma.bookmark.findMany({
        where : {
            userId : userId
        }
    })

    const videoURL = await prisma.video.findMany({})

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
            }),
            bookmarked : bookmark.some(item => item.contestId === contest.contest_code)
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
            }),
            bookmarked : bookmark.some(item => item.contestId === contest.contest_code),
            video : (videoURL.find(item => item.contestId === contest.contest_code) || {}).videoURL || ""
        })
    })

    codeforcesContest.data.result.map((contest : any)=>{
        if(contest.phase === "BEFORE"){
            upcomminingContest.push({
                contest_type : "codeforces",
                contest_id : contest.id.toString(),
                contest_name : contest.name,
                contest_duration : contest.durationSeconds.toString(),
                contest_time : new Date(contest.startTimeSeconds*1000).toLocaleString("en-IN",{
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: true
                }),
                bookmarked : bookmark.some(item => item.contestId === contest.id.toString())
            })
        }

        else if(contest.phase === "FINISHED"){
            previousContest.push({
                contest_type : "codeforces",
                contest_id : contest.id.toString(),
                contest_name : contest.name,
                contest_time : new Date(contest.startTimeSeconds*1000).toLocaleString("en-IN",{
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: true
                }),
                bookmarked : bookmark.some(item => item.contestId === contest.id.toString()),
                video : (videoURL.find(item => item.contestId === contest.id.toString()) || {}).videoURL || ""
            })
        }
    })

    res.status(200).json({

        upcomminingContest : upcomminingContest.sort((a, b)=> new Date(a.contest_time).getTime() - new Date(b.contest_time).getTime()),

        previousContest : previousContest.sort((a, b)=> new Date(a.contest_time).getTime()- new Date(b.contest_time).getTime()).reverse()
    })

})


app.post('/signup', async(req : any, res : any)=> {

    const {email, password } = req.body
    try{
        const user = await prisma.user.findFirst({
            where : {
                name : email
            }
        })

        if(user){
            return res.status(301).json({
                message : "user already exist"
            })
        }

        const newUser = await prisma.user.create({
            data : {
                name : email,
                password : password,
                userType : "student"
            }
        })

        const token = sign({email}, "secret")

        res.status(200).json({
            message : "signin sucessful",
            userType : "student",
            token
        })
    }
    catch(e){
        res.status(404).json({
            message : "server error"
        })
    }
})


app.post('/signin', async(req : any, res : any)=>{

    const {email, password, userType} = req.body;

    try{
        const user = await prisma.user.findFirst({
            where : {
                name : email,
                password : password,
                userType : userType
            }
        })

        if(!user){
            return res.status(301).json({
                message : "user doesn't exist"
            })
        }

        const token = sign({email} , "secret")

        res.status(200).json({
            message : "signin sucessful",
            userType : user.userType,
            token
        })
    }
    catch(e){
        req.status(404).json({
            message : "server error"
        })
    }
})


app.post('/bookmark', authMiddleware, async(req : any, res : any) => {

    const { userId } = req.userInfo
    const { contestId } = req.body

    try{
        const bookmark = await prisma.bookmark.findFirst({
            where : {
                userId : userId,
                contestId : contestId
            }
        })

        if(bookmark) {
            await prisma.bookmark.delete({
                where : {
                    id : bookmark.id
                }
            })

            res.status(200).json({
                Message : "contest unmark"
            })
            return;
        }

        await prisma.bookmark.create({
            data : {
                userId : userId,
                contestId : contestId
            }
        })

        res.status(200).json({
            Message : "contest mark"
        })
    }
    catch(e){
        res.status(404).json({
            message : "server error"
        })
    }

})


app.post('/video', authMiddleware, async(req : any, res : any) => {

    const { userType } = req.userInfo
    const { contestId, videoURL } = req.body

    if(userType !== "admin"){
        res.status(401).json({ 
            message: "You can't add" 
        });
        return;
    }

    try{
        await prisma.video.create({
            data : {
                videoURL : videoURL,
                contestId : contestId
            }
        })

        res.status(200).json({
            Message : "video added"
        })
    }
    catch(e){
        res.status(404).json({
            message : "server error"
        })
    }
})


app.listen(3000, ()=>{
    console.log('server is listining')
})