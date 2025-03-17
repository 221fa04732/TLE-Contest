import { Link } from "react-router-dom"
import { Theamatom } from "../atoms/Theam"
import { useRecoilValue } from "recoil"

export default function Hamburger(){

    const theam = useRecoilValue(Theamatom)

    return(<div className={`flex flex-col p-2 text-xl gap-2 rounded-sm border border-stone-500 ${theam === 'dark' ? "bg-stone-800" : "bg-white"}`}>

        <Link to={'/home'} 
            className={`py-1 px-6 rounded-sm ${theam === 'dark' ? "hover:bg-stone-700" : "hover:bg-stone-300"}`}>Home
        </Link>

        <Link to={'/upcommingContest'} 
            className={`py-1 px-6 rounded-sm ${theam === 'dark' ? "hover:bg-stone-700" : "hover:bg-stone-300"}`}>Upcomming
        </Link>

        <Link to={'/previousContest'} 
            className={`py-1 px-6 rounded-sm ${theam === 'dark' ? "hover:bg-stone-700" : "hover:bg-stone-300"}`}>Previous
        </Link>

        <Link to={'/favourite'} 
            className={`py-1 px-6 rounded-sm ${theam === 'dark' ? "hover:bg-stone-700" : "hover:bg-stone-300"}`}>Bookmark
        </Link>
        
    </div>)
}