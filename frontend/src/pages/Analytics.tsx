import Footer from "../components/Footer"
import ProfileCard from "../components/ProfileCard"
import { Analyticatom } from "../atoms/Analytic"
import { useRecoilState } from "recoil"
import { useEffect, useState } from "react"
import axios from 'axios'
import { config } from "../config"



type leetcodeData = {
    totalSolved : number,
    easySolved : number,
    mediumSolved : number,
    hardSolved : number,
    rank : number,
    reputation : number,
}


type codechefData = {
    userName : string,
    currentRating : number,
    highestRating : number,
    country : string,
    GlobalRank : number,
    countryRank : number,
    star : string,
    totalContest : number
}


type codeforcesData = {
    contribution : number,
    rating : number,
    friend : number,
    rank : string,
    userName : string,
    highestRating : number,
    highestRank : string
}


export default function Analytics(){

    const [analyticloader, setAnalyticloader] = useRecoilState(Analyticatom)
    const [leetcodeData, setleetcodedata] = useState<leetcodeData>()
    const [codeforcesData, setcodeforces] = useState<codeforcesData>()
    const [codechefData, setcodechef] = useState<codechefData>()
    const token = localStorage.getItem("tle-token")
    const codechefID = localStorage.getItem("codechefID")
    const leetcodeID = localStorage.getItem("leetcodeID")
    const codeforcesID = localStorage.getItem("codeforcesID")


    useEffect(()=>{
        setAnalyticloader(true)
        const contestData = async()=>{


            try{
                if(leetcodeID !== "null"){
                    const leetcode = await axios.post(`${config.BACKEND_URL}/analytic-leetcode`,{
                        leetcodeID : leetcodeID
                    },{
                        headers : {
                            Authorization : token
                        }
                    })

                    if(leetcode){
                        setleetcodedata(leetcode.data.leetcodeData)
                    }  }  
                }
            
            catch(e){
                console.log("leetcode data not found")
            }
            try{
                if(leetcodeID !== "null"){
                    const codechef = await axios.post(`${config.BACKEND_URL}/analytic-codechef`,{
                        codechefID : codechefID
                    },{
                        headers : {
                            Authorization : token
                        }
                    })

                    if(codechef){
                        setcodechef(codechef.data.codechefData)
                    }    
                }        
            }
            catch(e){
                console.log("codechef data not found")
            }
            try{
                if(leetcodeID !== "null"){
                    const codeforces = await axios.post(`${config.BACKEND_URL}/analytic-codeforces`,{
                        codeforcesID : codeforcesID
                    },{
                        headers : {
                            Authorization : token
                        }
                    })

                    if(codeforces){
                        setcodeforces(codeforces.data.codeforcesData)
                    }   
                }         
            }
            catch(e){
                console.log("codechef data not found")
            }
            finally{
                setAnalyticloader(false) 
            }
            
        }
        contestData()

        const timer = setInterval(contestData, 60000)

        return ()=> clearInterval(timer)
    }, [])

    if(analyticloader){
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
    
    return(<div className="bg-stone-800 min-hscreen flex flex-col items-center w-full text-white">

        <div className={`w-full flex flex-col items-center `}>
            <div className="w-full flex flex-col items-center">
                <ProfileCard />
            </div>
        
            <div className="w-10/12 mx-auto p-6 pt-20">
                <div className=" rounded-2xl shadow-md p-6 border mb-20 ">
                    <h2 className="text-xl font-bold text-purple-700 mb-4">CodeChef</h2>
                    <div className="space-y-2 text-gray-400">
                    <p><strong>Username:</strong> {codechefData?.userName}</p>
                    <p><strong>Current Rating:</strong> {codechefData?.currentRating} ({codechefData?.star})</p>
                    <p><strong>Highest Rating:</strong> {codechefData?.highestRating}</p>
                    <p><strong>Global Rank:</strong> {codechefData?.GlobalRank}</p>
                    <p><strong>Country Rank:</strong> {codechefData?.countryRank} ({codechefData?.country})</p>
                    <p><strong>Total Contests:</strong> {codechefData?.totalContest}</p>
                    </div>
                </div>

                <div className=" rounded-2xl shadow-md p-6 border mb-20 ">
                    <h2 className="text-xl font-bold text-yellow-500 mb-4">LeetCode</h2>
                    <div className="space-y-2 text-gray-400">
                    <p><strong>Total Solved:</strong> {leetcodeData?.totalSolved}</p>
                    <p><strong>Easy:</strong> {leetcodeData?.easySolved}</p>
                    <p><strong>Medium:</strong> {leetcodeData?.mediumSolved}</p>
                    <p><strong>Hard:</strong> {leetcodeData?.hardSolved}</p>
                    <p><strong>Rank:</strong> {leetcodeData?.rank}</p>
                    <p><strong>Reputation:</strong> {leetcodeData?.reputation}</p>
                    </div>
                </div>

                <div className=" rounded-2xl shadow-md p-6 border">
                    <h2 className="text-xl font-bold text-blue-600 mb-4">Codeforces</h2>
                    <div className="space-y-2 text-gray-400">
                    <p><strong>Username:</strong> {codeforcesData?.userName}</p>
                    <p><strong>Rating:</strong> {codeforcesData?.rating}</p>
                    <p><strong>Rank:</strong> {codeforcesData?.rank}</p>
                    <p><strong>Highest Rating:</strong> {codeforcesData?.highestRating}</p>
                    <p><strong>Highest Rank:</strong> {codeforcesData?.highestRank}</p>
                    <p><strong>Contribution:</strong> {codeforcesData?.contribution}</p>
                    <p><strong>Friends:</strong> {codeforcesData?.friend}</p>
                    </div>
                </div>
            </div>
        </div>

        <div className="flex justify-center w-full sm:mt-16">
            < Footer />
        </div>
    </div>)
}