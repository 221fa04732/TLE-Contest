import { useState, useEffect } from "react"
import axios from 'axios'
import PastContestCard from "./PastCard"
import DebounceHook from "../hooks/Debounce"
import { PastLoader } from "../atoms/PastLoader"
import { useRecoilState, useRecoilValue } from "recoil"
import Loader from "./Loader"
import { Theamatom } from "../atoms/Theam" 

export default function PastContest(){

    type pastContest = {
        contest_type : string
        contest_id : string
        contest_name : string
        contest_time : string
        bookmarked : boolean
        video : string
    }

    const [previousContest, setPreviousContest] = useState<pastContest[]>([])
    const [filterPreviousContest, setFilterPreviousContest] = useState<pastContest[]>([])
    const [typedWord, setTypedword] = useState("")
    const search = DebounceHook(typedWord)
    const token = localStorage.getItem("tle-token")
    const [pastLoader, setPastloader] = useRecoilState(PastLoader)
    const theam = useRecoilValue(Theamatom)


    useEffect(()=>{

        setPastloader(true)
        const previousData = async()=>{
            try{
                const response = await axios.get('http://localhost:3000/contest',{
                    headers : {
                        Authorization : token
                    }
                })
    
                if(response){
                    setPreviousContest(response.data.previousContest)
                }
            }
            catch(e){
                console.log("server error")
            }
            finally{
                setPastloader(false)
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
    

    return(<div className="flex flex-col">

        <div className="fixed w-11/12 mt-16">
            <input type="text" 
                className={`border h-10 outline-none w-full pl-2 z-20 rounded-sm text-blue-500 ${theam === 'dark' ? "border-white bg-stone-700" : "border-black bg-sky-50"}`}
                placeholder="search"
                value={typedWord}
                onChange={(e)=>{
                    setTypedword(e.target.value)
                }}
            />

            {search &&  previousContest=== filterPreviousContest ? <div className="text-red-600">no items found</div> : null}
        </div>
        
        <div className="mt-28">
            {pastLoader ? <Loader /> : 
                filterPreviousContest.map((contest)=>(
                    <PastContestCard key={contest.contest_id+contest.contest_name}
                        contest_type = { contest.contest_type }
                        contest_id = { contest.contest_id }
                        contest_name = { contest.contest_name }
                        contest_time = {contest.contest_time}
                        bookmarked = {contest.bookmarked}
                        video = {contest.video}
                    />
                ))
            }
        </div>
    </div>)

}   