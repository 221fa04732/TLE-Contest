import { useEffect, useState } from "react"
import axios from 'axios'
import FututreContestCard from "./FutureCard"
import PastContestCard from "./PastCard"

export default function FavouriteContest(){

    type futureContest = {
        contest_type : string
        contest_id : string
        contest_name : string
        contest_duration : string
        contest_time : string
        bookmarked : boolean
    }

    type pastContest = {
        contest_type : string
        contest_id : string
        contest_name : string
        contest_time : string
        bookmarked : boolean
        video : string
    }

    const [upcommingContest, setUpcommingContest] = useState<futureContest[]>([])
    const [previousContest, setPreviousContest] = useState<pastContest[]>([])
    const token = localStorage.getItem("tle-token")

    useEffect(()=>{

        const upcommingData = async()=>{
            const response = await axios.get('http://localhost:3000/contest',{
                headers : {
                    Authorization : token
                }
            })

            if(response){
                setUpcommingContest(response.data.upcomminingContest)
                setPreviousContest(response.data.previousContest)
            }
        }

        upcommingData();

        const timer = setInterval(upcommingData, 60000)

        return ()=> clearInterval(timer)
    }, [])


    return(<div className="pt-6">

        {upcommingContest.map((contest)=>(
            contest.bookmarked && <FututreContestCard key={contest.contest_id+contest.contest_name}
            contest_type = { contest.contest_type }
            contest_id = { contest.contest_id }
            contest_name = { contest.contest_name }
            contest_duration = { contest.contest_duration }
            contest_time = { contest.contest_time } 
            bookmarked = {contest.bookmarked}
             />
        ))}

        {previousContest.map((contest)=>(
            contest.bookmarked && <PastContestCard key={contest.contest_id+contest.contest_name}
                contest_type = { contest.contest_type }
                contest_id = { contest.contest_id }
                contest_name = { contest.contest_name }
                contest_time = {contest.contest_time}
                bookmarked = {contest.bookmarked}
                video = {contest.video}
                />
        ))}
    </div>)
}