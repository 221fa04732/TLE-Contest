import { Link, } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { Profileatom } from "../atoms/Profileatom";
import { useSetRecoilState } from "recoil";
import { useRef } from "react";

export default function Profile(){

    const userType = localStorage.getItem("userType") 
    const profiledropdown = useRef<HTMLDivElement>(null)
    const UpperCaseName = "mritynjay"
    const navigate = useNavigate();
    const setProfileVisible = useSetRecoilState(Profileatom)
    
    return(<div ref={profiledropdown} className="bg-stone-700 text-white flex flex-col mt-1 p-2 rounded-md border border-gray-500 sm:text-base text-sm w-full min-w-52">
        <div className="border-b border-stone-600 mb-1 pb-1 flex flex-col w-full">
            <div className="hover:bg-stone-600 w-full py-1 px-2 rounded-md max-h-8 flex">
                <img src="./profile.png" className="max-h-5 min-h-5 min-w-5 max-w-5 mr-3" />
                {UpperCaseName}
            </div>
            <div className="hover:bg-stone-600 w-full py-1 px-2 rounded-md max-h-8 flex">
                <img src="./followers.png" className="max-h-5 min-h-5 min-w-5 max-w-5 mr-3" />
                Followers : Na
            </div>
        </div>
        <div className="border-b border-stone-600 mb-1 pb-1 flex flex-col w-full">
            <Link to={'/analytics'} onClick={()=>{
                setProfileVisible(false)
            }} className="hover:bg-stone-600 w-full py-1 px-2 rounded-md max-h-8 flex justify-start items-center">
                <img src="./analytic.png" className="max-h-5 min-h-5 min-w-5 max-w-5 mr-3" />
                <div>Your Analytics</div>
            </Link>
            <Link to={'/editprofile'} onClick={()=>{
                setProfileVisible(false)
            }} className="hover:bg-stone-600 w-full py-1 px-2 rounded-md max-h-8 flex justify-start items-center">
                <img src="./yourblog.png" className="max-h-5 min-h-5 min-w-5 max-w-5 mr-3" />
                <div>Edit Profile</div>
            </Link>
            {userType === "admin" ? <Link to={'/admin'} onClick={()=>{
                setProfileVisible(false)
            }} className="hover:bg-stone-600 w-full py-1 px-2 rounded-md max-h-8 flex justify-start items-center">
                <img src="./setting.png" className="max-h-5 min-h-5 min-w-5 max-w-5 mr-3"/>
                <div>Admin Page</div>
            </Link> : null} 
        </div>
        <button onClick={()=>{
            localStorage.removeItem("tle-token")
            localStorage.removeItem("userType")
            setProfileVisible(false)
            navigate('/home')
        }} className="hover:bg-stone-600 w-full py-1 px-2 rounded-md flex justify-start items-center max-h-8">
            <img src="./logout.png" className="max-h-5 min-h-5 min-w-5 max-w-5 mr-3"/>
            <div>Log out</div>
        </button>
    </div>)
}