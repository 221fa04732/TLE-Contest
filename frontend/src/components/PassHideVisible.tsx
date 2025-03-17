import { useRecoilState } from "recoil"
import { PasswordVisible } from "../atoms/PasswordVisible"

export default function PasswordVisibleHide(){

    const [visible, setVisible] = useRecoilState(PasswordVisible)
    return(<div className="mr-1">
        <button 
        className="flex items-center justify-center cursor-pointer"
        onClick={()=>{
            setVisible(!visible)
        }}><img src={visible ? "./hide.png" : "./visible.png"} className="max-h-6 max-w-6"/></button>
    </div>)
}