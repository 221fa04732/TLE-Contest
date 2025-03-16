import { useEffect, useState } from "react";

const DebounceHook = (word : string)=>{

    const [search, setSearch] = useState(word)

    useEffect(()=>{

        const timer = setTimeout(()=>{
            setSearch(word)
        },500)

        return ()=> clearTimeout(timer)

    }, [word])

    return search

}

export default DebounceHook;