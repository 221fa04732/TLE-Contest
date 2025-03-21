import CountdownTimer from "./CountDown";
import BookMarked from "./BookMark";
import { Theamatom } from "../atoms/Theam";
import { useRecoilValue } from "recoil";

type futureContest = {
    contest_type : string
    contest_id : string
    contest_name : string
    contest_duration : string
    contest_time : string
    bookmarked : boolean
}

export default function FututreContestCard(props : futureContest){

    const theam = useRecoilValue(Theamatom)
    let contestURL = "";

    if(props.contest_type === 'codechef'){
        contestURL=`https://www.codechef.com/${props.contest_id}`
    }
    else if(props.contest_type === 'codeforces'){
        contestURL=`https://codeforces.com/contests/${props.contest_id}`
    }
    else if(props.contest_type === 'leetcode'){
        const tempid = props.contest_id.split('').slice(2, props.contest_id.length).join('')
        if(props.contest_id[1]==='b'){
            contestURL=`https://leetcode.com/contest/biweekly-contest-${tempid}`
        }
        else{
            contestURL=`https://leetcode.com/contest/weekly-contest-${tempid}`
        }
    }

    return(<div className="flex flex-col justify-center p-8 border-1 mt-4">
        <div className="w-full flex justify-between">
            <div className="flex">
                <div>{props.contest_type === "codechef" ? 
                    <img src="./codechef.png" className="min-h-6 max-h-6 min-w-6 max-w-6"/> : props.contest_type === "leetcode" ? 
                    <img src="./leetcode.svg" className="min-h-6 max-h-6 min-w-6 max-w-6"/> : <img src="./codeforces.svg" className="min-h-6 max-h-6 min-w-6 max-w-6"/>}
                </div>
                <div className={`pl-4  text-xl ${theam === 'dark' ? "text-white" : "text-stone-400"}`}>{props.contest_name}</div>
            </div>
            <div><BookMarked contestId={props.contest_id} bookmark={props.bookmarked} /></div>
        </div>
        <div>Contest Date : {props.contest_time}</div>
        <div>Contest Duration : {props.contest_duration} min</div>
        <div className="flex justify-between">
            <CountdownTimer targetDate={props.contest_time} />
            <a href={contestURL} target="_blank" className="bg-blue-700 px-2 py-1 text-white rounded-sm">Register</a>
        </div>
    </div>)
}