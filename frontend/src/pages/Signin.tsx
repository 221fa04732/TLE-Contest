import { useState } from "react"
import axios from 'axios'
import { useNavigate } from "react-router-dom"

export default function SigninPage(){

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [userType, setUserType] = useState(false)
    const navigate = useNavigate();

    async function handleSignIn(){
        try{
            const response = await axios.post('http://localhost:3000/signin',{
                email : email,
                password : password,
                userType : userType ? "admin" : "student"
            }) 

            if(response){
                localStorage.setItem("tle-token", response.data.token)
                localStorage.setItem("userType", response.data.userType)
                navigate('/home')
            }
        }
        catch(e){
            console.log("server error")
        }
    }

    return(<div>
        <div>
            <input type="text"
                value={email}
                onChange={(e)=>{
                    setEmail(e.target.value)
                }
            }/>

            <input type="password" 
                value={password}
                onChange={(e)=>{
                    setPassword(e.target.value)
                }
            }/>

            <input type="checkbox" 
                checked={userType}
                onChange={(e)=>{
                    setUserType(e.target.checked)
                }
            }/>

            <button onClick={()=>{
                handleSignIn()
            }}>Sign In</button>
        </div>
    </div>)
}