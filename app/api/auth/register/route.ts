import { connectDB } from "@/lib/db";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { sendVerificationEmail } from "@/lib/email";
export async function POST(request:NextRequest){
    try{
        const {name,email,password} = await request.json()
        console.log("Received registration data:", { name, email, password });
        if(!name || !email || !password){
            console.error("All fields are required")
         return NextResponse.json({message:"All fields are required"}, {status:400})
        }
        if(password.length< 6 ){
            console.log("Password must be at least 6 characters")
            return NextResponse.json({message:"Password must be at least 6 characters"}, {status:400})
        }

        await connectDB();
        const existingUser = await User.findOne({email})
        if (existingUser) {
            console.log("User already exists")
            return NextResponse.json({message:"User already exists"}, {status:400})
        }

        console.log("Creating new user")
        const hashedPassword = await bcrypt.hash(password, 12);
        const verificationToken =crypto.randomBytes(32).toString("hex");
        const user = await User.create({
            name,
            email,
            password:hashedPassword,
            verificationToken,
            emailVerified:false,
            role:"user"
        })


        console.log("User created successfully:", user)
        const emailResult = await sendVerificationEmail(email,verificationToken)
        if(!emailResult){
                  console.log("Failed to send verification email:", emailResult)
            return NextResponse.json({message:"Log sending verification email"}, {status:500})
        }

        return NextResponse.json({message:"User created successfully. Please check your email to verify your account", userId:user._id}, {status:201})


    }

    catch(error){
        console.log("Registration error:", error);
        return NextResponse.json({message:"Registration error"}, {status:500})
    }
}