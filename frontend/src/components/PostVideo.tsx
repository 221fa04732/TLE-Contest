import { useState } from "react"
import axios from 'axios'
import { Theamatom } from "../atoms/Theam"
import { useRecoilValue, useSetRecoilState } from "recoil"
import { ToastHandleatom } from "../atoms/ToastHandle"
import { config } from "../config"

export default function PostVideo(props : {
    contestId : string
}){

    const [videoURL, setVideoURL] = useState("")
    const [postLoader, setPostLoader] = useState<boolean>(false);
    const token = localStorage.getItem("tle-token")
    const theam = useRecoilValue(Theamatom)
    const setToast = useSetRecoilState(ToastHandleatom)

    async function handleAddVideo(){

        if(videoURL === ""){
            setToast({
                message : "Invalid Input",
                colour : "green",
                visible : true
            })
            return;
        }

        setPostLoader(true)
        try{
            const response = await axios.post(`${config.BACKEND_URL}/video`,{
                contestId : props.contestId,
                videoURL : videoURL
            },{
                headers : {
                    Authorization : token
                }
            }) 

            if(response){
                setToast({
                    message : response.data.Message,
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
        setPostLoader(false)
    }

    return(<div className="flex gap-2">
        <input type="text" className={`outline-none border-1  pl-1 rounded-sm ${theam === 'dark' ? "border-white" : "border-black"}`}
            placeholder="Youtube_Link"
            value={videoURL}
            onChange={(e)=>{
                setVideoURL(e.target.value)
            }
        } />

        {postLoader ? <button className="bg-blue-700 px-2 py-1 text-white rounded-sm cursor-pointer">
                <img src="./loading.gif" className="min-h-5 max-w-5" />
            </button> : 
            <button className="bg-blue-700 px-2 py-1 text-white rounded-sm cursor-pointer" onClick={()=>{
                handleAddVideo()
            }}>add video</button>}

    </div>)
}