import { useState } from "react"
import axios from 'axios'

export default function PostVideo(props : {
    contestId : string
}){

    const [videoURL, setVideoURL] = useState("")
    const [postLoader, setPostLoader] = useState<boolean>(false);
    const token = localStorage.getItem("tle-token")

    async function handleAddVideo(){

        setPostLoader(true)
        try{
            const response = await axios.post('http://localhost:3000/video',{
                contestId : props.contestId,
                videoURL : videoURL
            },{
                headers : {
                    Authorization : token
                }
            }) 

            if(response){
                console.log(response.data)
            }
        }
        catch(e){
            console.log("server error")
        }
        setPostLoader(false)
    }

    return(<div>
        <input type="text" 
            value={videoURL}
            onChange={(e)=>{
                setVideoURL(e.target.value)
            }
        } />

        {postLoader ? <div>WAIT</div> : 
            <button onClick={()=>{
                handleAddVideo()
            }}>add video</button>}

    </div>)
}