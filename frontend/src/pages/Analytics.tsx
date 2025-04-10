import Footer from "../components/Footer"
import ProfileCard from "../components/ProfileCard"

export default function Analytics(){
    
    return(<div className="bg-stone-800 min-hscreen flex flex-col items-center w-full text-white">

        <div className={`w-full flex flex-col items-center`}>
                <div className="w-full flex flex-col items-center">
                <ProfileCard />
            </div>
        </div>

        <div className="flex justify-center w-full sm:mt-16">
            < Footer />
        </div>
    </div>)
}