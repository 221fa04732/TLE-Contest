import { Link } from "react-router-dom"
import { Theamatom } from "../atoms/Theam"
import { useRecoilState } from "recoil"

export default function Header(){

    const [theam, setTheam] = useRecoilState(Theamatom)

    return(<div className="flex justify-between items-center min-h-14">
        <div className="flex">
            <img src="./tle.png" className="min-h-8 max-h-8 min-w-8 max-w-8" />
            <div className="text-xl font-bold pl-1">TLE Contest</div>
        </div>

        <div className="flex gap-6 text-lg">
            <Link to={'/home'}>Home</Link>
            <Link to={'/upcommingContest'}>Upcomming</Link>
            <Link to={'/previousContest'}>Previous</Link>
        </div>

        <div className="flex items-center justify-center">
            <button onClick={()=>{
                if(theam === 'dark'){
                    setTheam("light")
                }
                else{
                    setTheam('dark')
                }
            }}><img className="min-h-6 max-h-6 min-w-6 max-w-6" src={theam === 'dark' ? 'light_mode.png' : './dark_mode.png'} />
            </button>
        </div>
    </div>)
}