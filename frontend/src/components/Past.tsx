import { useState, useEffect } from "react"
import axios from 'axios'
import PastContestCard from "./PastCard"
import DebounceHook from "../hooks/Debounce"
import { PastLoader } from "../atoms/PastLoader"
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil"
import Loader from "./Loader"
import { Theamatom } from "../atoms/Theam" 
import { ToastHandleatom } from "../atoms/ToastHandle"
import Backup from "./Backup"
import { config } from "../config"

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
    const [typedWord, setTypedword] = useState("")
    const search = DebounceHook(typedWord)
    const token = localStorage.getItem("tle-token")
    const [pastLoader, setPastloader] = useRecoilState(PastLoader)
    const theam = useRecoilValue(Theamatom)
    const limit = 20;
    const [page, setPage] = useState(1)
    const [hasMore, setHasmore] = useState(false)
    const setToast = useSetRecoilState(ToastHandleatom)

    useEffect(()=>{
        setPage(1)
    },[search])

    useEffect(()=>{

        setPastloader(true)
        const previousData = async()=>{
            try{
                const response = await axios.get(`${config.BACKEND_URL}/contest?type=past&search=${search}&limit=${limit}&page=${page}`,{
                    headers : {
                        Authorization : token
                    }
                })
    
                if(response){
                    setPreviousContest(response.data.previousContest)
                    setHasmore(response.data.hasMore)
                }
            }
            catch(e){
                setHasmore(false)
                setToast({
                    message : "Server error",
                    colour : "red",
                    visible : true
                })
            }
            finally{
                setPastloader(false)
            }
        }
        
        previousData();

        const timer = setInterval(previousData, 60000)

        return ()=> clearInterval(timer)

    },[page, search])

    return(<div className="flex flex-col">

        <div className={`fixed w-11/12 mt-20 flex items-center border ${theam === "dark" ? "border-white bg-stone-800 text-white" : "border-black bg-white text-black"} rounded-sm`}>
            <img src="./search.png" className={`max-h-6 max-w-6 ml-2`} />
            <input type="text" 
                className={`h-12 outline-none w-full pl-2 z-20 text-xl`}
                placeholder="search contest"
                value={typedWord}
                onChange={(e)=>{
                    setTypedword(e.target.value)
                }}
            />
        </div>
        
        <div className="mt-32">
            {pastLoader ? <Loader /> : 
                previousContest.length > 0 ?
                previousContest.map((contest)=>(
                    <PastContestCard key={contest.contest_id+contest.contest_name}
                        contest_type = { contest.contest_type }
                        contest_id = { contest.contest_id }
                        contest_name = { contest.contest_name }
                        contest_time = {contest.contest_time}
                        bookmarked = {contest.bookmarked}
                        video = {contest.video}
                    />
                )) : <Backup />
            }
        </div>

        <div className="flex justify-end gap-2 mt-6">

            {page > 1 && <button 
                className="bg-red-400 px-2 py-1 text-white rounded-sm flex justify-center cursor-pointer"
                onClick={() => {
                    setPage(page -1)
                    scrollTop()
                }}>⬅ Previous page
            </button>}

            {hasMore && <button 
                className="bg-green-400 px-2 py-1 text-white rounded-sm flex justify-center cursor-pointer"
                onClick={() => {
                    setPage(page + 1)
                    scrollTop()
                }}>Next Page ➡
            </button>}
        </div>

    </div>)

}   

function scrollTop(){
    window.scroll({
        top : 0,
        behavior : "smooth"
    })
}