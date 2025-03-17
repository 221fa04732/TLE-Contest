import { Link } from "react-router-dom"

export default function Landing(){
    return(<div className="flex flex-col justify-center items-center">
        <div className="text-5xl sm:text-9xl font-bold pt-16"><span className="text-blue-500">TLE</span> Contest</div>
        <div className="text-2xl sm:text-6xl pt-8 font-medium">Stay Ahead in <span className="text-blue-400">Competitive Coding</span></div>
        <div className="text-lg sm:text-2xl pt-10">Track and explore all ongoing and past contests from top platforms like CodeChef, Codeforces, LeetCode, and more—never miss a chance to compete and improve!</div>
        <div className="pt-16 flex justify-center gap-4">
            <Link to={'/upcommingContest'} className="bg-blue-700 px-2 py-1 text-white rounded-sm animate-bounce">Upcomming</Link>
            <Link to={'/previousContest'} className="bg-blue-700 px-2 py-1 text-white rounded-sm animate-bounce">Previous</Link>
        </div>
    </div>)
}