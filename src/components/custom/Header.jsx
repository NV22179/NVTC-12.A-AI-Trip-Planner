import React, { useEffect, useState } from 'react';
import { Button } from '../ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { googleLogout, useGoogleLogin } from '@react-oauth/google';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
} from "@/components/ui/dialog"
import { FcGoogle } from "react-icons/fc";
import axios from 'axios';



function Header() {
  const user=JSON.parse(localStorage.getItem('user'));
  const [openDialog,setOpenDialog]=useState(false);

  
  useEffect(() =>{
    console.log(user)
  },[])

  const login=useGoogleLogin({
    onSuccess:(codeResp)=>GetUserProfile(codeResp),
    onError:(error)=>console.log(error)
  })
  
  const GetUserProfile=(tokenInfo)=>{
    axios.get(`https://www.googleapis.com/oauth2/v1/userinfo?acess_token=${tokenInfo?.access_token}`,{
      headers: {
       Authorization: `Bearer ${tokenInfo?.access_token}`,
       Accept:'Application/json'
      }
    }).then((resp) => {console.log(resp);
      localStorage.setItem('user',JSON.stringify(resp.data));
      setOpenDialog(false);
      window.location.reload();
    })
  }

  return (
    <div className='p-3 shadow-sm flex justify-between items-center px-4'>
      <img src="/src/assets/NVTC2.png"/>
      <div >
       {user? 
       <div className='flex items-center gap-4'>
        <a href="/">
          <Button variant="outline" className="rounded-full border border-gray-300 text-gray-700 hover:bg-blue-500 hover:text-white transition duration-300">Home</Button>
      </a>
      <a href="/create-trip">
          <Button variant="outline" className="rounded-full border border-gray-300 text-gray-700 hover:bg-blue-500 hover:text-white transition duration-300">Create Trip</Button>
      </a>
      <a href="/my-trips">
          <Button variant="outline" className="rounded-full border border-gray-300 text-gray-700 hover:bg-blue-500 hover:text-white transition duration-300">My Trips</Button>
      </a>

         <Popover>
          <PopoverTrigger>
          <img 
    src={user?.picture} 
    className='rounded-full w-[38px] h-[38px] transition-transform duration-300 hover:scale-110 hover:shadow-lg' 
/>

          </PopoverTrigger>
          <PopoverContent>
            <h2 className="cursor-pointer" onClick={()=>{
              googleLogout();
              localStorage.clear();
              window.location.reload();
            }}>Logout</h2>
           
          </PopoverContent>
         </Popover>

       </div>
       : <Button onClick={()=>setOpenDialog(true)}>Sign In</Button> 
       }
      </div>
      
      <Dialog open={openDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogDescription>
            <img src="/src/assets/NVTC.png"/>
              <h2 className="font-bold text-lg mt-6">Sign In with Google</h2>
              <p>Sign In to the App with Google authentication securely</p>
              <Button 
              onClick={login} className="w-full mt-5 flex gap-4 items-center">
                <FcGoogle className="h-7 w-7"/>
                Sign In With Google
              </Button>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>

    </div>
  )
}

export default Header
