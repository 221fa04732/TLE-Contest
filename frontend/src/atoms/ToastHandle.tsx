import { atom } from 'recoil'
 
 type ToastHandle = {
     message : string;
     colour : string;
     visible : boolean
 }
 
 export const ToastHandleatom = atom<ToastHandle>({
     key : "toastnotificationatom",
     default : {
         message : "",
         colour : "",
         visible : false
     }
 })