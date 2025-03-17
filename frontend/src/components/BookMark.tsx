import { useState } from "react"
import axios from 'axios'

export default function BookMarked(props : {
    contestId : string,
    bookmark : boolean
}){

    const [bookmarkLoader, setBookmarkLoader] = useState(false)
    const token = localStorage.getItem("tle-token")

    async function handleBookmark() {
        setBookmarkLoader(true)
        try{
            const response = await axios.post('http://localhost:3000/bookmark',{
                contestId : props.contestId,
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