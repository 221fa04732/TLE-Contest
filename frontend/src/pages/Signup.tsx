import { useState } from "react"

export default function SignupPage(){

    const [email, setEmail] = useState<string>("")
    const [password, setPassword] = useState<string>("")

    async function handleSignup(){

        

    }

    return(<div>
        <div>
            <input className=""
                type="text" 
                value={email}
                onChange={(e)=>{
                    setEmail(e.target.value)
                }}
            />
            <input className=""
                type="password" 
                value={password}
                onChange={(e)=>{
                    setPassword(e.target.value)
                }}
            />
            <button className=""
                onClick={()=>{
                    handleSignup()
                }}>
            </button>
        </div>
    </div>)
}