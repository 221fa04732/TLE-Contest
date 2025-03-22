import { Link } from "react-router-dom"

export default function Landing(){
    return(<div className="flex flex-col justify-center items-center">
        <div className="text-3xl sm:text-6xl font-bold font-sans pt-20"><span className="text-blue-500">TLE</span> Contest</div>
        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
            <img src="./coding.png" className="px-10"/>
            <div className="flex flex-col justify-center items-center">
                <div className="text-xl sm:text-2xl pt-8 font-medium">Stay Ahead in <span className="text-blue-400">Competitive Coding</span></div>
                <div className="text-lg sm:text-xl pt-10">Track and explore all ongoing and past contests from top platforms like CodeChef, Codeforces, LeetCode, and more—never miss a chance to compete and improve!</div>
                <div className="pt-16 flex justify-center gap-4">
                <Link to={'/upcommingContest'} className="bg-blue-700 px-2 py-1 text-white rounded-sm animate-bounce">Upcomming</Link>
                <Link to={'/previousContest'} className="bg-blue-700 px-2 py-1 text-white rounded-sm animate-bounce">Previous</Link>
                </div>
            </div>
        </div>
    </div>)
}