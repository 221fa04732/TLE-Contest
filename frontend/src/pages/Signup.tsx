import { useState } from "react"
import axios from 'axios'
import { useNavigate } from "react-router-dom"
import { Link } from "react-router-dom"
import { SignLoader } from "../atoms/SignLoader"
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil"
import PasswordVisibleHide from "../components/PassHideVisible"
import { PasswordVisible } from "../atoms/PasswordVisible"
import { ToastHandleatom } from "../atoms/ToastHandle"

export default function SignupPage(){

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const navigate = useNavigate();
    const [signLoader, setSignloader] = useRecoilState(SignLoader)
    const visible = useRecoilValue(PasswordVisible)
    const setToast = useSetRecoilState(ToastHandleatom)

    async function handleSignUp(){

        if(email === "" || password === ""){
          setToast({
            message : "Invalid Input",
            colour : "red",
            visible : true
          })
          return;
        }

        setSignloader(true)
        try{
            const response = await axios.post('http://localhost:3000/signup',{
                email : email,
                password : password
            }) 

            if(response){
                localStorage.setItem("tle-token", response.data.token)
                localStorage.setItem("userType", response.data.userType)
                navigate('/home')
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
        setSignloader(false)
    }

    return (
        <div className="min-h-screen w-full flex justify-center items-center">
          <div className="flex flex-col p-6 border border-white">
            <div className="flex justify-center text-2xl mb-4">SignUp</div>
      
            <label>Email</label>
            <input
              type="text"
              className="outline-none border border-white pl-2 min-h-8 min-w-80 mb-3"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
              }}
            />
      
            <label htmlFor="">Password</label>
            <div className="flex items-center border border-white mb-3">
                <input type={visible ? "text" : "password"} 
                    className="outline-none pl-2 min-h-8 min-w-80"
                    value={password}
                    onChange={(e)=>{
                        setPassword(e.target.value)
                    }
                }/>
                <PasswordVisibleHide />
            </div>

            <div className="pb-3">
                already have account ? <Link to={'/signin'} className="text-red-500">Sign In</Link>
            </div>
      
            {signLoader ?  
            <button className="bg-blue-700 px-2 py-1 text-white rounded-sm cursor-pointer flex justify-center"><img src="./loading.gif" className="min-h-5 max-w-5" />
            </button> : 
            <button
              className="bg-blue-700 px-2 py-1 text-white rounded-sm cursor-pointer"
              onClick={() => {
                handleSignUp();
              }}>Sign Up
            </button> }
          </div>
        </div>
      );
      
}