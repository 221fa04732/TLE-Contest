import { useState } from "react"
import { ToastHandleatom } from "../atoms/ToastHandle"
import { useRecoilState, useSetRecoilState } from "recoil"
import axios from "axios"
import { config } from "../config"
import { Profileloaderatom } from "../atoms/ProfileLoader"


export default function EditProfile(){

    const [name1, setName1] = useState('')
    const [name2, setName2] = useState('')
    const [name3, setName3] = useState('')
    const [email1, setEmail1] = useState('')
    const [email2, setEmail2] = useState('')
    const [email3, setEmail3] = useState('')
    const [codechef, setcodechef] = useState('')
    const [leetcode, setleetcode] = useState('')
    const [codeforces, setcodeforces] = useState('')
    const setAlertmessage = useSetRecoilState(ToastHandleatom)
    const [profileLoader, setProfileloader] = useRecoilState(Profileloaderatom)
    const token = localStorage.getItem("tle-token")


    async function updatecodechefID(){

        if(codechef === ''){
            setAlertmessage({
                visible : true,
                message : "Invalid Input",
                colour : "red"
            })
        }
        else{
            
            try{
                const response = await axios.post(`${config.BACKEND_URL}/codechef-profile`,{
                    codechefURL : codechef
                },{
                    headers :{
                        Authorization : token
                    }
                })
    
                setAlertmessage({
                    visible : true,
                    message : response.data.Message,
                    colour : "green"
                })
            }
            catch(e){
                setAlertmessage({
                    visible : true,
                    message : "Internal Server Error",
                    colour : "red"
                })
            }
        }
        setProfileloader(false)

    }


    async function updateleetcodeID(){

        if(leetcode === ''){
            setAlertmessage({
                visible : true,
                message : "Invalid Input",
                colour : "red"
            })
        }
        else{
            
            try{
                const response = await axios.post(`${config.BACKEND_URL}/leetcode-profile`,{
                    leetcodeURL : leetcode
                },{
                    headers :{
                        Authorization : token
                    }
                })
    
                setAlertmessage({
                    visible : true,
                    message : response.data.Message,
                    colour : "green"
                })
            }
            catch(e){
                setAlertmessage({
                    visible : true,
                    message : "Internal Server Error",
                    colour : "red"
                })
            }
        }
        setProfileloader(false)

    }


    async function updatecodeforces(){

        if(codeforces === ''){
            setAlertmessage({
                visible : true,
                message : "Invalid Input",
                colour : "red"
            })
        }
        else{
            
            try{
                const response = await axios.post(`${config.BACKEND_URL}/codeforces-profile`,{
                    codeforcesURL : codeforces
                },{
                    headers :{
                        Authorization : token
                    }
                })
    
                setAlertmessage({
                    visible : true,
                    message : response.data.Message,
                    colour : "green"
                })
            }
            catch(e){
                setAlertmessage({
                    visible : true,
                    message : "Internal Server Error",
                    colour : "red"
                })
            }
        }
        setProfileloader(false)

    }


    if (profileLoader) {
        return (
            <div className="animate-pulse w-full min-h-screen flex flex-col justify-center items-center">
                <div className="border border-stone-600 w-11/12 px-8 py-12">
                    <div className="h-16 bg-stone-700 rounded w-6/12 mb-6"></div>
                    <div className="h-16 bg-stone-700 rounded w-full mb-6"></div>
                    <div className="h-12 bg-stone-700 rounded mb-6"></div>
                    <div className="h-6 bg-stone-700 rounded w-8/12 mb-6"></div>
                    <div className="h-12 bg-stone-700 rounded w-10/12 mb-6"></div>
                </div> 
            </div>
        );
    }
    

    return(<div className="bg-stone-800 pt-16 w-full flex flex-col items-center font-handwritten">
        
        <div className="text-3xl font-bold text-red-500 pb-16">Edit Your Coding Profile</div>

        <fieldset className="border border-gray-300 sm:w-11/12 w-full mb-16 flex flex-col justify-center sm:p-6 p-2 pb-6">
            <legend className="text-blue-500 sm:text-lg text-base sm:ml-6 ml-2 px-1">Update Codechef Profile</legend>
            <label className="text-gray-400">Your name</label>
            <input className="w-full bg-stone-800 focus:outline-none border border-gray-600 rounded-sm px-4 py-2"
            type="text" 
            value={name1}
            onChange={(e)=>{
                setName1(e.target.value)
            }}
            ></input>
            <label className="pt-6 text-gray-400">Your email</label>
            <input className="w-full bg-stone-800 focus:outline-none border border-gray-600 rounded-sm px-4 py-2"
            type="text"
            value={email1}
            onChange={(e)=>{
                setEmail1(e.target.value)
            }}
            ></input>
            <label className="pt-6 text-gray-400">Codechef username<span className="text-red-600">*</span> </label>
            <input className="w-full bg-stone-800 focus:outline-none border border-gray-600 rounded-sm px-4 py-2"
            type="text"
            value={codechef}
            onChange={(e)=>{
                setcodechef(e.target.value)
            }}
            ></input>
            <div className="flex justify-center w-full mt-8">
                <button onClick={()=>{
                    setProfileloader(true)
                    updatecodechefID()
                }} className="text-lg px-4 py-2 rounded-md  shadow-black shadow-md">Update</button>
            </div>
        </fieldset>

        <fieldset className="border border-gray-300 sm:w-11/12 w-full mb-16 flex flex-col justify-center sm:p-6 p-2 pb-6">
            <legend className="text-blue-500 sm:text-lg text-base sm:ml-6 ml-2 px-1">Update Leetcode Profile</legend>
            <label className="text-gray-400">Your name</label>
            <input className="w-full bg-stone-800 focus:outline-none border border-gray-600 rounded-sm px-4 py-2"
            type="text" 
            value={name2}
            onChange={(e)=>{
                setName2(e.target.value)
            }}
            ></input>
            <label className="pt-6 text-gray-400">Your email</label>
            <input className="w-full bg-stone-800 focus:outline-none border border-gray-600 rounded-sm px-4 py-2"
            type="text"
            value={email2}
            onChange={(e)=>{
                setEmail2(e.target.value)
            }}
            ></input>
            <label className="pt-6 text-gray-400">Leetcode username<span className="text-red-600">*</span> </label>
            <input className="w-full bg-stone-800 focus:outline-none border border-gray-600 rounded-sm px-4 py-2"
            type="text"
            value={leetcode}
            onChange={(e)=>{
                setleetcode(e.target.value)
            }}
            ></input>
            <div className="flex justify-center w-full mt-8">
                <button onClick={()=>{
                    setProfileloader(true)
                    updateleetcodeID()
                }} className="text-lg px-4 py-2 rounded-md  shadow-black shadow-md">Update</button>
            </div>
        </fieldset>

        <fieldset className="border border-gray-300 sm:w-11/12 w-full mb-16 flex flex-col justify-center sm:p-6 p-2 pb-6">
            <legend className="text-blue-500 sm:text-lg text-base sm:ml-6 ml-2 px-1">Update Codeforces Profile</legend>
            <label className="text-gray-400">Your name</label>
            <input className="w-full bg-stone-800 focus:outline-none border border-gray-600 rounded-sm px-4 py-2"
            type="text" 
            value={name3}
            onChange={(e)=>{
                setName3(e.target.value)
            }}
            ></input>
            <label className="pt-6 text-gray-400">Your email</label>
            <input className="w-full bg-stone-800 focus:outline-none border border-gray-600 rounded-sm px-4 py-2"
            type="text"
            value={email3}
            onChange={(e)=>{
                setEmail3(e.target.value)
            }}
            ></input>
            <label className="pt-6 text-gray-400">Codeforces username<span className="text-red-600">*</span> </label>
            <input className="w-full bg-stone-800 focus:outline-none border border-gray-600 rounded-sm px-4 py-2"
            type="text"
            value={codeforces}
            onChange={(e)=>{
                setcodeforces(e.target.value)
            }}
            ></input>
            <div className="flex justify-center w-full mt-8">
                <button onClick={()=>{
                    setProfileloader(true)
                    updatecodeforces()
                }} className="text-lg px-4 py-2 rounded-md  shadow-black shadow-md">Update</button>
            </div>
        </fieldset>
        
    </div>)
}