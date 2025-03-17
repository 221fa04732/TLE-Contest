import BookMarked from "./BookMark";
import PostVideo from "./PostVideo";
import { Theamatom } from "../atoms/Theam";
import { useRecoilValue } from "recoil";

type pastContest = {
    contest_type : string
    contest_id : string
    contest_name : string
    contest_time : string
    bookmarked : boolean
    video : string
}

export default function PastContestCard(props : pastContest){

    const userType = localStorage.getItem("userType")
    const theam = useRecoilValue(Theamatom)
    let contestURL = "";

    if(props.contest_type === 'codechef'){
        contestURL=`https://www.codechef.com/${props.contest_id}`
    }
    else if(props.contest_type === 'codeforces'){
        contestURL=`https://codeforces.com/contests/${props.contest_id}`
    }

    return(<div className="flex flex-col justify-center p-8 border-1 mt-4">
        <div className="w-full flex justify-between">
            <div className="flex">
                <div>{props.contest_type === "codechef" ? 
                    <img src="./codechef.png" className="min-h-6 max-h-6 min-w-6 max-w-6"/> : 
                    <img src="./codeforces.svg" className="min-h-6 max-h-6 min-w-6 max-w-6"/>}
                </div>
                <div className={`pl-4 text-xl ${theam === 'dark' ? "text-white" : "text-stone-400"}`}>{props.contest_name}</div>
            </div>
            <div><BookMarked contestId={props.contest_id} bookmark={props.bookmarked} /></div>
        </div>
        <div>{props.contest_time}</div>
        <div>Contest ended</div>
        <div className="flex justify-end gap-4 flex-col sm:flex-row">
            <a href={contestURL} target="_blank" className="bg-blue-700 px-2 py-1 text-white rounded-sm flex justify-center">Go to Contest</a>
            {props.video === "" ? (userType === "admin" ? <PostVideo contestId={props.contest_id} /> : null) : <a href={props.video} target="_blank" className="bg-blue-700 px-2 py-1 text-white rounded-sm flex justify-center">Video Solution</a>}
        </div>
    </div>)
}