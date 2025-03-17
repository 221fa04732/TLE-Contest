import { useEffect, useState } from "react"
import axios from 'axios'
import FututreContestCard from "./FutureCard"
import DebounceHook from "../hooks/Debounce"
import { FutureLoader } from "../atoms/FutureLoader"
import { useRecoilState, useRecoilValue } from "recoil"
import Loader from "./Loader"
import { Theamatom } from "../atoms/Theam"

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
    const [futureLoader, setFutureloader] = useRecoilState(FutureLoader)
    const theam = useRecoilValue(Theamatom)

    useEffect(()=>{
        setFutureloader(true)
        const upcommingData = async()=>{
            try{
                const response = await axios.get('http://localhost:3000/contest',{
                    headers : {
                        Authorization : token
                    }
                })
    
                if(response){
                    setUpcommingContest(response.data.upcomminingContest)
                }
            }
            catch(e){
                console.log("server error")
            }
            finally{
                setFutureloader(false)
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

            {search && upcommingContest === filterUpcommingContest ? <div className="text-red-600">no items found</div> : null}
        </div>

        <div className="mt-28">
            {futureLoader ? <Loader /> : 
                filterUpcommingContest.map((contest)=>(
                    <FututreContestCard key={contest.contest_id+contest.contest_name}
                    contest_type = { contest.contest_type }
                    contest_id = { contest.contest_id }
                    contest_name = { contest.contest_name }
                    contest_duration = { contest.contest_duration }
                    contest_time = { contest.contest_time } 
                    bookmarked = {contest.bookmarked}
                    />
                ))
            }
        </div>
    </div>)
}