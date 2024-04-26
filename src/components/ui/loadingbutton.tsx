import { Loader2 } from "lucide-react"
import { Button, type ButtonProps } from "./button"

//using type instead of interface to use the union type
//this will take the normal props of a button plus the loading prop
type LoadingButtonProps = {
    loading: boolean
} & ButtonProps


export default function LoadingButton({ 
    children,
    loading,
    ...props
}: LoadingButtonProps){
    return (
        //button will be disabled if loadaing is true or if the disabled prop is true
        <Button {...props} disabled={props.disabled ?? loading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin"/>}
            {children}
        </Button>
    )

}