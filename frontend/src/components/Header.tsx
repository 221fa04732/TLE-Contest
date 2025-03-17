import { Link } from "react-router-dom"
import { Theamatom } from "../atoms/Theam"
import { useRecoilState } from "recoil"
import { useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"

export default function Header(){

    const [theam, setTheam] = useRecoilState(Theamatom)
    const [login, setLogin] = useState(false)
    const token = localStorage.getItem("tle-token")
    const navigate = useNavigate();

    useEffect(()=>{
        if(token){
            setLogin(true)
        }
    }, [])

    return(<div className="flex justify-between items-center min-h-14">
        <div className="flex">
            <img src="./tle.png" className="min-h-8 max-h-8 min-w-8 max-w-8" />
            <div className="text-xl font-bold pl-1">TLE Contest</div>
        </div>

        <div className="flex gap-6 text-lg">
            <Link to={'/home'}>Home</Link>
            <Link to={'/upcommingContest'}>Upcomming</Link>
            <Link to={'/previousContest'}>Previous</Link>
            <Link to={'/favourite'}>Bookmark</Link>
        </div>

        <div className="flex items-center justify-center">
            <button onClick={()=>{
                if(theam === 'dark'){
                    setTheam("light")
                }
                else{
                    setTheam('dark')
                }
            }}><img className="min-h-6 max-h-6 min-w-6 max-w-6 cursor-pointer" src={theam === 'dark' ? 'light_mode.png' : './dark_mode.png'} />
            </button>

            <div className="ml-2 bg-green-500 rounded-sm text-white">{login ? 
                <button className="cursor-pointer px-2 py-1" onClick={()=>{
                    localStorage.removeItem("userType")
                    localStorage.removeItem("tle-token")
                    setLogin(false)
                }}>Logout</button> : 
                <button className="cursor-pointer px-2 py-1" onClick={()=>{
                    navigate('/signin')
                }}>SignIn</button>
            }</div>
            
        </div>
    </div>)
}