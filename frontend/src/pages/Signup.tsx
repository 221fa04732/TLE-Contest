import { useState } from "react"
import axios from 'axios'
import { useNavigate } from "react-router-dom"

export default function SignupPage(){

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const navigate = useNavigate();

    async function handleSignUp(){
        try{
            const response = await axios.post('http://localhost:3000/signup',{
                email : email,
                password : password
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

            <button onClick={()=>{
                handleSignUp()
            }}>Sign Up</button>
        </div>
    </div>)
}