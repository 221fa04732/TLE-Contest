import Header from "../components/Header"
import PastContest from "../components/Past"
import { Theamatom } from "../atoms/Theam"
import { useRecoilValue } from "recoil"
import Footer from "../components/Footer"

export default function PreviousPage(){

    const theam = useRecoilValue(Theamatom)

    return(<div className={`w-full flex flex-col items-center justify-center`}>

        <div className={`${theam === 'dark' ? 'bg-stone-800 text-gray-400' : 'bg-white text-black'} w-full border-b border-blue-500 flex justify-center items-center fixed top-0 z-50 `}>
            <div className="w-11/12">
                <Header />
            </div>
        </div>

        <div className="w-11/12 min-h-screen">
            <PastContest />
        </div>

        <div className="mt-6">
            <Footer />
        </div>

    </div>)
}