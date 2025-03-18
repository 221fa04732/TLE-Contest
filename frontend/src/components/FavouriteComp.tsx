import { useEffect, useState } from "react"
import axios from 'axios'
import FututreContestCard from "./FutureCard"
import PastContestCard from "./PastCard"
import { BookmarkLoader } from "../atoms/BookmarkLoader"
import Loader from "./Loader"
import { useRecoilState, useSetRecoilState } from "recoil"
import { ToastHandleatom } from "../atoms/ToastHandle"
import Backup from "./Backup"

export default function FavouriteContest(){

    window.scroll({
        top : 0,
        behavior : "smooth"
    })

    type bookmarkContest = {
        contest_type : string
        contest_id : string
        contest_name : string
        contest_time : string
        contest_duration : string 
        contest_status : string
        video : string
        bookmarked : boolean
    }

    const [bookmarkContest, setBookmarkContest] = useState<bookmarkContest[]>([])
    const token = localStorage.getItem("tle-token")
    const [bookmarkLoader, setBookmarkloader] = useRecoilState(BookmarkLoader)
    const limit = 20;
    const [page, setPage] = useState(1)
    const [hasMore, setHasmore] = useState(false)
    const setToast = useSetRecoilState(ToastHandleatom)

    useEffect(()=>{
        setBookmarkloader(true)
        const upcommingData = async()=>{
            try{
                const response = await axios.get(`http://localhost:3000/contest?type=bookmarked&limit=${limit}&page=${page}`,{
                    headers : {
                        Authorization : token
                    }
                })
    
                if(response){
                    setBookmarkContest(response.data.allBookmark)
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
                setBookmarkloader(false)
            }
        }

        upcommingData();

        const timer = setInterval(upcommingData, 60000)

        return ()=> clearInterval(timer)
    }, [page])

    return(<div className="flex flex-col">

        <div>
            {bookmarkLoader ? <Loader /> : 
                bookmarkContest.length > 0 ?
                bookmarkContest.map((contest)=>(
                    contest.contest_status === "future" ? 
                    (<FututreContestCard key={contest.contest_id+contest.contest_name}
                        contest_type = { contest.contest_type }
                        contest_id = { contest.contest_id }
                        contest_name = { contest.contest_name }
                        contest_duration = { contest.contest_duration }
                        contest_time = { contest.contest_time } 
                        bookmarked = {contest.bookmarked}
                    />) : 
                    (<PastContestCard key={contest.contest_id+contest.contest_name}
                        contest_type = { contest.contest_type }
                        contest_id = { contest.contest_id }
                        contest_name = { contest.contest_name }
                        contest_time = {contest.contest_time}
                        bookmarked = {contest.bookmarked}
                        video = {contest.video}
                    />)
                )) : <Backup />
            }
        </div>

        <div className="flex justify-end gap-2 mt-6">

            {page > 1 && <button 
                className="bg-red-400 px-2 py-1 text-white rounded-sm flex justify-center cursor-pointer"
                onClick={() => setPage(page - 1)}>⬅ Previous page
            </button>}

            {hasMore && <button 
                className="bg-green-400 px-2 py-1 text-white rounded-sm flex justify-center cursor-pointer"
                onClick={() => setPage(page + 1)}>Next Page ➡
            </button>}
        </div>

    </div>)
}