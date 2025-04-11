import { Link } from "react-router-dom"
import { useRecoilValue } from "recoil"
import { Theamatom } from "../atoms/Theam"

export default function Landing(){
    const theme = useRecoilValue(Theamatom)

    return(<div className="min-h-screen w-full flex items-center justify-center">
        <div className="w-full max-w-7xl mx-4 p-8 md:p-12">
            <div className="text-4xl sm:text-6xl lg:text-7xl font-bold pt-4 text-center">
                <span className={`${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`}>TLE</span> Contest
            </div>
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                <video src="./video.mp4"
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full max-w-lg mx-auto"
                />

                <div className="flex flex-col justify-center items-center md:items-start space-y-6">
                    <div className="text-2xl sm:text-3xl lg:text-4xl font-medium text-center md:text-left">
                        Stay Ahead in <span className={`${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`}>Competitive Coding</span>
                    </div>
                    <div className="text-base sm:text-lg opacity-90 text-center md:text-left">
                        Track and explore all ongoing and past contests from top platforms like CodeChef, Codeforces, LeetCode, and more—never miss a chance to compete and improve!
                    </div>
                    <div className="pt-4 flex flex-col sm:flex-row justify-center md:justify-start gap-4 sm:gap-8 w-full">
                        <Link to={'/upcommingContest'} className="button-3d-blue bg-blue-600 px-8 py-3.5 text-white rounded-xl text-lg font-semibold flex items-center justify-center gap-3">
                            <span>Upcoming</span>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                        </Link>
                        <Link to={'/previousContest'} className="button-3d-gray bg-gray-700 px-8 py-3.5 text-white rounded-xl text-lg font-semibold flex items-center justify-center gap-3">
                            <span>Previous</span>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L4.414 9H17a1 1 0 110 2H4.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                            </svg>
                        </Link>
                    </div>
                </div>
            </div>

            <div className="mt-16 features-section">
                <div className="grid md:grid-cols-2 gap-8">
                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="feature-card p-6 rounded-xl">
                            <div className="icon-container w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center mb-4">
                                <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-semibold mb-2">Contest Tracking</h3>
                            <p className="text-gray-500 text-sm">Track contests from CodeChef, CodeForces, LeetCode</p>
                        </div>
                        <div className="feature-card p-6 rounded-xl">
                            <div className="icon-container w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center mb-4">
                                <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-semibold mb-2">Analytics</h3>
                            <p className="text-gray-500 text-sm">Track your performance and progress</p>
                        </div>
                    </div>
                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="stat-card text-center p-6 rounded-xl">
                            <div className="text-2xl font-bold text-blue-500 mb-1">500+</div>
                            <div className="text-sm text-gray-500">Contests Tracked</div>
                        </div>
                        <div className="stat-card text-center p-6 rounded-xl">
                            <div className="text-2xl font-bold text-blue-500 mb-1">5+</div>
                            <div className="text-sm text-gray-500">Platforms</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>)
}