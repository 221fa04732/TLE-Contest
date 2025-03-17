import { useState } from "react"
import axios from 'axios'
import { useNavigate } from "react-router-dom"
import { Link } from "react-router-dom"
import { SignLoader } from "../atoms/SignLoader"
import { useRecoilState } from "recoil"

export default function SigninPage(){

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [userType, setUserType] = useState(false)
    const navigate = useNavigate();
    const [signLoader, setSignloader] = useRecoilState(SignLoader)

    async function handleSignIn(){

        setSignloader(true)
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
        setSignloader(false)
    }

    return(<div className="min-h-screen w-full flex justify-center items-center">
        
        <div className="flex flex-col p-6 border border-white">
            <div className="flex justify-center text-2xl mb-4">SignIn</div>

            <label htmlFor="">Email</label>
            <input type="text"
                className="outline-none border border-white pl-2 min-h-8 min-w-80 mb-3"
                value={email}
                onChange={(e)=>{
                    setEmail(e.target.value)
                }
            }/>

            <label htmlFor="">Password</label>
            <input type="password" 
                className="outline-none border border-white pl-2 min-h-8 min-w-80 mb-2"
                value={password}
                onChange={(e)=>{
                    setPassword(e.target.value)
                }
            }/>

            <div className="flex mb-4">
                <input type="checkbox" 
                    className="min-h-4 min-w-4 cursor-pointer"
                    checked={userType}
                    onChange={(e)=>{
                        setUserType(e.target.checked)
                    }
                }/>
                <div className="pl-2 text-blue-500">SignIn as admin</div>
            </div>

            <div className="pb-3">
                don't have account ? <Link to={'/signup'} className="text-red-500">Create one</Link>
            </div>
            
            {signLoader ? 
            <button className="bg-blue-700 px-2 py-1 text-white rounded-sm cursor-pointer flex justify-center"><img src="./loading.gif" className="min-h-5 max-w-5" />
            </button> : 
            <button className="bg-blue-700 px-2 py-1 text-white rounded-sm cursor-pointer flex justify-center" onClick={()=>{
                handleSignIn()
            }}>Sign In
            </button>}
        </div>
    </div>)
}