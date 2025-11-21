'use client'

import { authClient } from "@/lib/auth-client"
import { useRouter } from "next/navigation"
import { toast } from "sonner"


export default function  useSignOut(){
  const router = useRouter()
  const handleSignOt = async ()=> {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: ()=> {
          toast.success('signed out successfuly')
          router.push('/')
        },
        onError: ()=> {
          toast.error("Try again later")
        }
      }
    })
  } 
  return handleSignOt
}