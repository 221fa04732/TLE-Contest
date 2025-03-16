import SigninPage from "../pages/Signin"

export default function Unauthorized(props : any){
    
    const token : string | null = localStorage.getItem("tle-token")

    return token ? props.children : <SigninPage />
}