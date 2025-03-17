import { lazy, Suspense } from "react"
import { Route, Routes } from "react-router-dom"
import { useRecoilValue } from "recoil"


const HomePage = lazy(()=> import('./pages/Home'))
const UpcommingPage = lazy(()=> import('./pages/Upcomming'))
const PreviousPage = lazy(()=> import('./pages/Previous'))
const FavouritePage = lazy(()=> import('./pages/Favorite'))


import Unauthorized from "./components/Unauthorized"
import SignupPage from "./pages/Signup"
import SigninPage from "./pages/Signin"
import Loader from "./components/Loader"
import { Theamatom } from "./atoms/Theam"


function App() {

  const theam = useRecoilValue(Theamatom)

  return (<div className={`${theam === 'dark' ? 'bg-stone-800 text-gray-400' : 'bg-white text-black'} min-h-screen`}>
    
    <Suspense fallback={<Loader />} >

      <Routes>

        <Route index element={<HomePage />} />

        <Route path="/home" element={<HomePage />} />

        <Route path="/signin" element={<SigninPage />} />

        <Route path="/signup" element={<SignupPage />} />

        <Route path="/upcommingContest" 
          element={
            <Unauthorized>
              <UpcommingPage />
            </Unauthorized>
          }
        />

        <Route path="/previousContest" 
          element={
            <Unauthorized>
              <PreviousPage />
            </Unauthorized>
          }
        />

        <Route path="/favourite"
          element={
            <Unauthorized>
              <FavouritePage />
            </Unauthorized>
          }
        />

      </Routes>

    </Suspense>

    </div>)
}

export default App
