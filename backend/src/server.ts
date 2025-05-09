import express, { response } from 'express'
import cors from 'cors'
import axios from 'axios'
import { PrismaClient } from '@prisma/client';
import { sign } from 'jsonwebtoken'
import authMiddleware from './auth';
import { leetcodeContest } from './leetcode';

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
    contest_status? : String
    bookmarked : boolean
}

type previousContest = {
    contest_type : string
    contest_id : string
    contest_name : string
    contest_time : string
    contest_status? : String
    bookmarked : boolean
    video : string
}


type leetcodeData = {
    totalSolved : number,
    easySolved : number,
    mediumSolved : number,
    hardSolved : number,
    rank : number,
    reputation : number,
}

type codechefData = {
    userName : string,
    currentRating : number,
    highestRating : number,
    country : string,
    GlobalRank : number,
    countryRank : number,
    star : string,
    totalContest : number
}


type codeforcesData = {
    contribution : number,
    rating : number,
    friend : number,
    rank : string,
    userName : string,
    highestRating : number,
    highestRank : string
}



app.get('/contest', authMiddleware, async(req : any, res : any)=>{

    const { userId } = req.userInfo;
    const dataType = req.query.type;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const search = req.query.search || ""
    const skip = (page - 1) * limit;

    try{

        const codechefContest = await axios.get('https://www.codechef.com/api/list/contests/all?sort_by=START&sorting_order=asc&offset=0&mode=all')

        const codeforcesContest = await axios.get("https://codeforces.com/api/contest.list")

        const bookmark = await prisma.bookmark.findMany({
            where : {
                userId : userId
            }
        })

        const videoURL = await prisma.video.findMany({})

        const leetcode =await leetcodeContest()

        let upcomminingContest : upcomminingContest[] =[]
        let previousContest : previousContest[] = []
        let bookmarkedupcomminingContest : upcomminingContest[] = []
        let bookmarkedpreviousContest : previousContest[] = []
        const userLocale = Intl.DateTimeFormat().resolvedOptions().locale || "en-IN";

        if(dataType === "future"){

            codechefContest.data.future_contests.map((contest : any)=>{
                upcomminingContest.push({
                    contest_type : "codechef",
                    contest_id : contest.contest_code,
                    contest_name : contest.contest_name,
                    contest_duration : contest.contest_duration,
                    contest_time : new Date(contest.contest_start_date_iso).toLocaleString(userLocale, {
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

            codeforcesContest.data.result.map((contest : any)=>{
                if(contest.phase === "BEFORE"){
                    upcomminingContest.push({
                        contest_type : "codeforces",
                        contest_id : contest.id.toString(),
                        contest_name : contest.name,
                        contest_duration : contest.durationSeconds.toString(),
                        contest_time : new Date(contest.startTimeSeconds*1000).toLocaleString(userLocale,{
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
            })

            upcomminingContest.push({
                contest_type : leetcode.weeklyContest.upcomming.contest_type,
                contest_id : leetcode.weeklyContest.upcomming.contest_id,
                contest_name : leetcode.weeklyContest.upcomming.contest_name,
                contest_duration : leetcode.weeklyContest.upcomming.contest_duration,
                contest_time : leetcode.weeklyContest.upcomming.contest_time,
                bookmarked : bookmark.some(item => item.contestId === leetcode.weeklyContest.upcomming.contest_id)
            })

            upcomminingContest.push({
                contest_type : leetcode.biweeklyContest.upcomming.contest_type,
                contest_id : leetcode.biweeklyContest.upcomming.contest_id,
                contest_name : leetcode.biweeklyContest.upcomming.contest_name,
                contest_duration : leetcode.biweeklyContest.upcomming.contest_duration,
                contest_time : leetcode.biweeklyContest.upcomming.contest_time,
                bookmarked : bookmark.some(item => item.contestId === leetcode.biweeklyContest.upcomming.contest_id)
            })

            if(search !== ""){
                upcomminingContest = upcomminingContest.filter((contest: any) =>
                    String(contest.contest_id).toLowerCase().includes(search.toLowerCase()) || 
                    contest.contest_type.toLowerCase().includes(search.toLowerCase()) ||
                    contest.contest_name.toLowerCase().includes(search.toLowerCase())
                );
            }

            return res.status(200).json({

                upcomminingContest : upcomminingContest.sort((a, b)=> new Date(a.contest_time).getTime() - new Date(b.contest_time).getTime()).slice(skip, skip+limit),

                hasMore: skip + limit < upcomminingContest.length
            })
        }

        else if(dataType === "past"){

            codechefContest.data.past_contests.map((contest : any)=>{
                previousContest.push({
                    contest_type : "codechef",
                    contest_id : contest.contest_code,
                    contest_name : contest.contest_name,
                    contest_time : new Date(contest.contest_start_date_iso).toLocaleString(userLocale, {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: true
                    }),
                    bookmarked : bookmark.some(item => item.contestId === contest.contest_code),
                    video : (videoURL.find(item => item.contestId === contest.contest_name.toLowerCase().split(" ").slice(0, 2).join(" ")) || {}).videoURL || ""
                })
            })
        
            codeforcesContest.data.result.map((contest : any)=>{
                if(contest.phase === "FINISHED"){
                    previousContest.push({
                        contest_type : "codeforces",
                        contest_id : contest.id.toString(),
                        contest_name : contest.name,
                        contest_time : new Date(contest.startTimeSeconds*1000).toLocaleString(userLocale,{
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                            hour12: true
                        }),
                        bookmarked : bookmark.some(item => item.contestId === contest.id.toString()),
                        video : (videoURL.find(item => item.contestId === contest.name.toString().toLowerCase()) || {}).videoURL || ""
                    })
                }
            })

            leetcode.weeklyContest.past.map((contest : any)=>{
                previousContest.push({
                    contest_type : contest.contest_type,
                    contest_id : contest.contest_id,
                    contest_name : contest.contest_name,
                    contest_time : contest.contest_time,
                    bookmarked : bookmark.some(item => item.contestId === contest.contest_id),
                    video : (videoURL.find(item => item.contestId.split(" ").slice(0, 4).join(" ") === contest.contest_name.toLowerCase()) || {}).videoURL || ""
                })
            })

            leetcode.biweeklyContest.past.map((contest : any)=>{
                previousContest.push({
                    contest_type : contest.contest_type,
                    contest_id : contest.contest_id,
                    contest_name : contest.contest_name,
                    contest_time : contest.contest_time,
                    bookmarked : bookmark.some(item => item.contestId === contest.contest_id),
                    video : (videoURL.find(item => item.contestId.split(" ").slice(0, 4).join(" ") === contest.contest_name.toLowerCase()) || {}).videoURL || ""
                })
            })

            if(search !== ""){
                previousContest = previousContest.filter((contest: any) =>
                    String(contest.contest_id).toLowerCase().includes(search.toLowerCase()) || 
                    contest.contest_type.toLowerCase().includes(search.toLowerCase()) ||
                    contest.contest_name.toLowerCase().includes(search.toLowerCase())
                );
            }

            return res.status(200).json({

                previousContest : previousContest.sort((a, b)=> new Date(a.contest_time).getTime()- new Date(b.contest_time).getTime()).reverse().slice(skip, skip+limit),

                hasMore: skip + limit < previousContest.length
            }) 
        }

        else if(dataType === "bookmarked"){

            codechefContest.data.future_contests.forEach((contest: any) => {
                if (bookmark.some(item => item.contestId === contest.contest_code)) {
                    bookmarkedupcomminingContest.push({
                        contest_type: "codechef",
                        contest_id: contest.contest_code,
                        contest_name: contest.contest_name,
                        contest_duration: contest.contest_duration,
                        contest_time: new Date(contest.contest_start_date_iso).toLocaleString(userLocale, {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                            hour12: true
                        }),
                        contest_status : "future",
                        bookmarked: true
                    });
                }
            });
            
            codeforcesContest.data.result.forEach((contest : any)=>{
                if(contest.phase === "BEFORE" && bookmark.some(item => item.contestId === contest.id.toString())){
                    bookmarkedupcomminingContest.push({
                        contest_type : "codeforces",
                        contest_id : contest.id.toString(),
                        contest_name : contest.name,
                        contest_duration : contest.durationSeconds.toString(),
                        contest_time : new Date(contest.startTimeSeconds*1000).toLocaleString(userLocale,{
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                            hour12: true
                        }),
                        contest_status : "future",
                        bookmarked : true
                    })
                }
            })

            codechefContest.data.past_contests.forEach((contest : any)=>{
                if(bookmark.some(item => item.contestId === contest.contest_code)){
                    bookmarkedpreviousContest.push({
                        contest_type : "codechef",
                        contest_id : contest.contest_code,
                        contest_name : contest.contest_name,
                        contest_time : new Date(contest.contest_start_date_iso).toLocaleString(userLocale, {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                            hour12: true
                        }),
                        contest_status : "past",
                        bookmarked : true,
                        video : (videoURL.find(item => item.contestId === contest.contest_name.toLowerCase().split(" ").slice(0, 2).join(" ")) || {}).videoURL || ""
                    })
                }
            })
        
            codeforcesContest.data.result.forEach((contest : any)=>{
                if(contest.phase === "FINISHED" && bookmark.some(item => item.contestId === contest.id.toString())){
                    bookmarkedpreviousContest.push({
                        contest_type : "codeforces",
                        contest_id : contest.id.toString(),
                        contest_name : contest.name,
                        contest_time : new Date(contest.startTimeSeconds*1000).toLocaleString(userLocale,{
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                            hour12: true
                        }),
                        contest_status : "past",
                        bookmarked : true,
                        video : (videoURL.find(item => item.contestId === contest.name.toString().toLowerCase()) || {}).videoURL || ""
                    })
                }
            })

            leetcode.weeklyContest.past.forEach((contest: any) => {
                if (bookmark.some(item => item.contestId === contest.contest_id)) {
                    bookmarkedpreviousContest.push({
                        contest_type: contest.contest_type,
                        contest_id: contest.contest_id,
                        contest_name: contest.contest_name,
                        contest_time: contest.contest_time,
                        contest_status : "past",
                        video : (videoURL.find(item => item.contestId.split(" ").slice(0, 4).join(" ") === contest.contest_name.toLowerCase()) || {}).videoURL || "",
                        bookmarked: true
                    });
                }
            });

            leetcode.biweeklyContest.past.forEach((contest: any) => {
                if (bookmark.some(item => item.contestId === contest.contest_id)) {
                    bookmarkedpreviousContest.push({
                        contest_type: contest.contest_type,
                        contest_id: contest.contest_id,
                        contest_name: contest.contest_name,
                        contest_time: contest.contest_time,
                        contest_status : "past",
                        video : (videoURL.find(item => item.contestId.split(" ").slice(0, 4).join(" ") === contest.contest_name.toLowerCase()) || {}).videoURL || "",
                        bookmarked: true
                    });
                }
            });

            if (bookmark.some(item => item.contestId === leetcode.weeklyContest.upcomming.contest_id)) {
                bookmarkedupcomminingContest.push({
                    contest_type: leetcode.weeklyContest.upcomming.contest_type,
                    contest_id: leetcode.weeklyContest.upcomming.contest_id,
                    contest_name: leetcode.weeklyContest.upcomming.contest_name,
                    contest_duration: leetcode.weeklyContest.upcomming.contest_duration,
                    contest_time: leetcode.weeklyContest.upcomming.contest_time,
                    contest_status : "future",
                    bookmarked: true
                });
            }

            if (bookmark.some(item => item.contestId === leetcode.biweeklyContest.upcomming.contest_id)) {
                bookmarkedupcomminingContest.push({
                    contest_type: leetcode.biweeklyContest.upcomming.contest_type,
                    contest_id: leetcode.biweeklyContest.upcomming.contest_id,
                    contest_name: leetcode.biweeklyContest.upcomming.contest_name,
                    contest_duration: leetcode.biweeklyContest.upcomming.contest_duration,
                    contest_time: leetcode.biweeklyContest.upcomming.contest_time,
                    contest_status : "future",
                    bookmarked: true
                });
            }

            
            bookmarkedupcomminingContest.sort((a, b)=> new Date(a.contest_time).getTime() - new Date(b.contest_time).getTime())

            bookmarkedpreviousContest.sort((a, b)=> new Date(a.contest_time).getTime()- new Date(b.contest_time).getTime()).reverse()

            const allBookmark = [...bookmarkedupcomminingContest, ...bookmarkedpreviousContest]

            return res.status(200).json({

                allBookmark : allBookmark.slice(skip, skip+limit),
                hasMore : skip + limit < allBookmark.length,
            })
        }

        return res.status(404).json({
            message : "Invalid request"
        })

    }
    catch(e){
        res.status(404).json({
            message : "Server error"
        })
    }
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
            return res.status(404).json({
                message : "User already exist"
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

        const leetcodeURL = await prisma.leetcodeProfile.findFirst({
            where : {
                userId : newUser.id
            }
        })

        const codeforcesURL = await prisma.codeforcesProfile.findFirst({
            where : {
                userId : newUser.id
            }
        })

        const codechefURL = await prisma.codechefProfile.findFirst({
            where : {
                userId : newUser.id
            }
        })

        res.status(200).json({
            message : "Signup sucessful",
            userType : "student",
            leetcodeURL : leetcodeURL,
            codechefURL : codechefURL,
            codeforcesURL : codeforcesURL,
            token
        })
    }
    catch(e){
        res.status(404).json({
            message : "Server error"
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
            return res.status(404).json({
                message : "User doesn't exist"
            })
            
        }

        const token = sign({email} , "secret")

        const leetcodeURL = await prisma.leetcodeProfile.findFirst({
            where : {
                userId : user.id
            }
        })

        const codeforcesURL = await prisma.codeforcesProfile.findFirst({
            where : {
                userId : user.id
            }
        })

        const codechefURL = await prisma.codechefProfile.findFirst({
            where : {
                userId : user.id
            }
        })

        res.status(200).json({
            message : "Signin sucessful",
            userType : user.userType,
            leetcodeURL : leetcodeURL?.leetcode,
            codechefURL : codechefURL?.codechef,
            codeforcesURL : codeforcesURL?.codeforces,
            token
        })
    }
    catch(e){
        res.status(404).json({
            message : "Server error"
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
                Message : "Contest unmark"
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
            Message : "Contest bookmark"
        })
    }
    catch(e){
        res.status(404).json({
            message : "Server error"
        })
    }

})


app.post('/video', authMiddleware, async(req : any, res : any) => {

    const { userType } = req.userInfo
    const { contestId, videoURL } = req.body

    if(userType !== "admin"){
        res.status(301).json({ 
            message: "Unauthorize access" 
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
            Message : "Video added"
        })
    }
    catch(e){
        res.status(404).json({
            message : "Server error"
        })
    }
})


app.post('/codechef-profile', authMiddleware, async(req : any, res : any) => {

    const { userId } = req.userInfo
    const { codechefURL } = req.body

    try{

        const codechef = await prisma.codechefProfile.findFirst({
            where : {
                userId : userId
            }
        })

        if(codechef){
            await prisma.codechefProfile.delete({
                where : {
                    id : codechef.id
                }
            })
        }
        await prisma.codechefProfile.create({
            data : {
                userId : userId,
                codechef : codechefURL
            }
        })

        res.status(200).json({
            Message : "Codechef URL added"
        })
    }
    catch(e){
        res.status(404).json({
            message : "Server error"
        })
    }
})


app.post('/leetcode-profile', authMiddleware,  async(req : any, res : any) => {

    const { userId } = req.userInfo
    const { leetcodeURL } = req.body

    try{

        const leetcode = await prisma.leetcodeProfile.findFirst({
            where : {
                userId : userId
            }
        })

        if(leetcode){
            await prisma.leetcodeProfile.delete({
                where : {
                    id : leetcode.id
                }
            })
        }

        await prisma.leetcodeProfile.create({
            data : {
                userId : userId,
                leetcode : leetcodeURL
            }
        })

        res.status(200).json({
            Message : "Leetcode URL added"
        })
    }
    catch(e){
        res.status(404).json({
            message : "Server error"
        })
    }
})


app.post('/codeforces-profile', authMiddleware, async(req : any, res : any) => {

    const { userId } = req.userInfo
    const { codeforcesURL } = req.body

    try{
        const codeforces = await prisma.codeforcesProfile.findFirst({
            where : {
                userId : userId
            }
        })

        if(codeforces){
            await prisma.codechefProfile.delete({
                where : {
                    id : codeforces.id
                }
            })
        }

        await prisma.codeforcesProfile.create({
            data : {
                userId : userId,
                codeforces : codeforcesURL
            }
        })

        res.status(200).json({
            Message : "Codeforces URL added"
        })
        
    }
    catch(e){
        res.status(404).json({
            message : "Server error"
        })
    }
})



app.post('/analytic-leetcode', authMiddleware, async(req : any, res : any)=>{

    const { leetcodeID } = req.body
    try{
        const leetcode = await axios.get(`https://leetcode-api-faisalshohag.vercel.app/${leetcodeID}`)

        const leetcodeData : leetcodeData = {
                totalSolved : leetcode.data.totalSolved,
                easySolved : leetcode.data.easySolved,
                mediumSolved : leetcode.data.mediumSolved,
                hardSolved : leetcode.data.hardSolved,
                rank : leetcode.data.ranking,
                reputation : leetcode.data.reputation,
        }

        res.status(200).json({
            leetcodeData
        })
    }
    catch(e){
        res.status(404).json({
            message : "Server error"
        })
    }
})


app.post('/analytic-codechef', authMiddleware, async(req : any, res : any)=>{

    const { codechefID } = req.body

        try{

            const codechef = await axios.get(`https://codechef-api.vercel.app/handle/${codechefID}`)
            const codechefData : codechefData = {
                userName : codechef.data.name,
                currentRating : codechef.data.currentRating,
                highestRating : codechef.data.highestRating,
                country : codechef.data.countryName,
                GlobalRank : codechef.data.globalRank,
                countryRank : codechef.data.countryRank,
                star : codechef.data.stars,
                totalContest : codechef.data.ratingData.length
            }

        res.status(200).json({
            codechefData
        })
    }
    catch(e){
        res.status(404).json({
            message : "Server error"
        })
    }
})


app.post('/analytic-codeforces', authMiddleware, async(req : any, res : any)=>{

    const { codeforcesID } = req.body

        try{
        const codeforces = await axios.get(`https://codeforces.com/api/user.info?handles=${codeforcesID}`)
            const codeforcesData : codeforcesData = {
                contribution : codeforces.data.result[0].contribution,
                rating : codeforces.data.result[0].rating,
                friend : codeforces.data.result[0].friendOfCount,
                rank : codeforces.data.result[0].rank,
                userName : codeforces.data.result[0].handle,
                highestRating :codeforces.data.result[0].maxRating,
                highestRank : codeforces.data.result[0].maxRank
            }

            res.status(200).json({
                codeforcesData
            }) 
        }
    catch(e){
        res.status(404).json({
            message : "Server error"
        })
    }
})

app.listen(3000, ()=>{
    console.log('server is listining')
})