import CountdownTimer from "./CountDown";
import BookMarked from "./BookMark";

type futureContest = {
    contest_type : string
    contest_id : string
    contest_name : string
    contest_duration : string
    contest_time : string
    bookmarked : boolean
}

export default function FututreContestCard(props : futureContest){

    let contestURL = "";

    if(props.contest_type === 'codechef'){
        contestURL=`https://www.codechef.com/${props.contest_id}`
    }
    else if(props.contest_type === 'codeforces'){
        contestURL=`https://codeforces.com/contests/${props.contest_id}`
    }

    return(<div className="flex flex-col justify-center items-center p-8 border-2 mt-4">
        <div>{props.contest_type === "codechef" ? 
            <img src="./codechef.png" className="min-h-6 max-h-6 min-w-6 max-w-6"/> : 
            <img src="./codeforces.svg" className="min-h-6 max-h-6 min-w-6 max-w-6"/>}
        </div>
        <div>{props.contest_name}</div>
        <div>{props.contest_duration}</div>
        <div>{props.contest_id}</div>
        <div>{props.contest_time}</div>
        <a href={contestURL} target="_blank">click</a>
        <CountdownTimer targetDate={props.contest_time} />
        <div><BookMarked contestId={props.contest_id} bookmark={props.bookmarked} /></div>
    </div>)
}