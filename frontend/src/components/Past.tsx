import { useState, useEffect } from "react"
import axios from 'axios'
import PastContestCard from "./PastCard"
import DebounceHook from "../hooks/Debounce"

export default function PastContest(){

    type pastContest = {
        contest_type : string
        contest_id : string
        contest_name : string
        contest_time : string
    }

    const [previousContest, setPreviousContest] = useState<pastContest[]>([])
    const [filterPreviousContest, setFilterPreviousContest] = useState<pastContest[]>([])
    const [typedWord, setTypedword] = useState("")
    const search = DebounceHook(typedWord)


    useEffect(()=>{

        const previousData = async()=>{
                    const response = await axios.get('http://localhost:3000/contest')
        
                    if(response){
                        setPreviousContest(response.data.previousContest)
                    }
                }
        
                previousData();
        
                const timer = setInterval(previousData, 60000)
        
                return ()=> clearInterval(timer)

    },[])


    useEffect(() => {
        const filterdata = previousContest.filter((contest: any) =>
            String(contest.contest_id).toLowerCase().includes(search.toLowerCase()) || 
            contest.contest_type.toLowerCase().includes(search.toLowerCase()) ||
            contest.contest_name.toLowerCase().includes(search.toLowerCase())
        );
    
        setFilterPreviousContest(filterdata.length > 0 ? filterdata : previousContest);
    }, [search, previousContest]);
    

    return(<div className="pt-6">

            <div>
                <input type="text" className="border w-full h-10"
                    value={typedWord}
                    onChange={(e)=>{
                        setTypedword(e.target.value)
                    }}
                />
            </div>
            {search &&  previousContest=== filterPreviousContest ? <div className="text-red-600">no items found</div> : null}

            {filterPreviousContest.map((contest)=>(
                <PastContestCard key={contest.contest_id+contest.contest_name}
                    contest_type = { contest.contest_type }
                    contest_id = { contest.contest_id }
                    contest_name = { contest.contest_name }
                    contest_time = {contest.contest_time}
                 />
            ))}
        </div>)

}   