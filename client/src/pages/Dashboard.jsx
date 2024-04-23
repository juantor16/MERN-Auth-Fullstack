import { useContext } from "react"
import { UserContext } from "../../context/userContext"

export default function () {
    const [user] = useContext(UserContext)
    return (
        <div> 
            <h1>Dashboard</h1>
            {!!user && (<h2>Welcome {user?.name}</h2>)}
        </div>
    )
}
