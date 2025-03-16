import { useEffect, useState } from "react"
import axios from 'axios'
import FututreContestCard from "./FutureCard"
import DebounceHook from "../hooks/Debounce"

export default function FutureContest(){

    type futureContest = {
        contest_type : string
        contest_id : string
        contest_name : string
        contest_duration : string
        contest_time : string
        bookmarked : boolean
    }

    const [upcommingContest, setUpcommingContest] = useState<futureContest[]>([])
    const [filterUpcommingContest, setFilterUpcommingContest] = useState<futureContest[]>([])
    const [typedWord, setTypedword] = useState("")
    const search = DebounceHook(typedWord)
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
            }
        }

        upcommingData();

        const timer = setInterval(upcommingData, 60000)

        return ()=> clearInterval(timer)
    }, [])


    useEffect(() => {
        const filterdata = upcommingContest.filter((contest: any) =>
            String(contest.contest_id).toLowerCase().includes(search.toLowerCase()) || 
            contest.contest_type.toLowerCase().includes(search.toLowerCase()) ||
            contest.contest_name.toLowerCase().includes(search.toLowerCase())
        );
    
        setFilterUpcommingContest(filterdata.length > 0 ? filterdata : upcommingContest);
    }, [upcommingContest, search]);


    return(<div className="pt-6">

        <div>
            <input type="text" className="border w-full h-10"
                value={typedWord}
                onChange={(e)=>{
                    setTypedword(e.target.value)
                }}
            />
        </div>

        {search && upcommingContest === filterUpcommingContest ? <div className="text-red-600">no items found</div> : null}

        {filterUpcommingContest.map((contest)=>(
            <FututreContestCard key={contest.contest_id+contest.contest_name}
            contest_type = { contest.contest_type }
            contest_id = { contest.contest_id }
            contest_name = { contest.contest_name }
            contest_duration = { contest.contest_duration }
            contest_time = { contest.contest_time } 
            bookmarked = {contest.bookmarked}
             />
        ))}
    </div>)
}