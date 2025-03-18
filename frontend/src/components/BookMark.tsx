import { useState } from "react"
import axios from 'axios'
import { ToastHandleatom } from "../atoms/ToastHandle"
import { useSetRecoilState } from "recoil"
import { config } from "../config"

export default function BookMarked(props : {
    contestId : string,
    bookmark : boolean
}){

    const [bookmarkLoader, setBookmarkLoader] = useState(false)
    const token = localStorage.getItem("tle-token")
    const setToast = useSetRecoilState(ToastHandleatom)

    async function handleBookmark() {
        setBookmarkLoader(true)
        try{
            const response = await axios.post(`${config.BACKEND_URL}/bookmark`,{
                contestId : props.contestId,
            },{
                headers : {
                    Authorization : token
                }
            }) 

            if(response){
                setToast({
                    message : response.data.message,
                    colour : "green",
                    visible : true
                })
            }
        }
        catch(e){
            setToast({
                message : "Server error",
                colour : "red",
                visible : true
            })
        }
        setBookmarkLoader(false)
    }

    return(<div>
        {bookmarkLoader ? <img src="./loading.gif" className="min-h-5 max-w-5" /> : 
            <button onClick={()=>{
                    handleBookmark();
                }}>
                <img src={props.bookmark ? "./bookmarkOK.png" : "./bookmark.png"} className="min-h-6 max-h-6 min-w-6 max-w-6 cursor-pointer"/>
            </button>
        }
    </div>)
}