import { connectDB } from "@/lib/db";
import User from "@/models/User";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req:NextRequest){
    try{
        const {searchParams}  = new URL(req.url);
        const token = searchParams.get("token")
        if(!token){
            return NextResponse.json({message:"Verification Token required but not found"}, {status:400})
        }
            console.log("Verification token:", token)
            await connectDB();
            const user = await User.findOne({verificationToken:token})
            if(!user){
                return NextResponse.json({error:"Invalid or expired verification token"}, {status:400})
            }
            await User.findByIdAndUpdate(user._id,{
                emailVerified:true,
                verificationToken:null
            })

            return NextResponse.redirect(new URL("/auth/verified",req.url))

            } catch(error){
                    console.error("Verification error:", error)
                    return NextResponse.json({error:"Verification error"}, {status:500})
            }
    
}