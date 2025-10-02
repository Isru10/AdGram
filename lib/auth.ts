// lib/auth.ts (Corrected)

import NextAuth, { AuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialProvider from "next-auth/providers/credentials";
import { connectDB } from "./db";
import bcrypt from "bcryptjs";
import User from "@/models/User";

export const authOptions: AuthOptions = {
    providers:[
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        }),

        CredentialProvider({
                name:"Credentials",
                credentials:{
                    email:{label:"Email",type:"email"},
                    password:{label:"Password",type:"password"}
                },

                // This part is already correct, no changes needed here.
                async authorize(credentials){
                    if (!credentials?.email || !credentials.password) return null 
                    await connectDB()
                    const user = await User.findOne({email:credentials.email});
                    if(!user) return null;
                    if(!user.emailVerified)  return null;

                    const isValid = await bcrypt.compare(credentials.password, user.password)
                    if(!isValid) return null

                    return {
                        id:user._id.toString(),
                        email:user.email,
                        name:user.name,
                        role:user.role
                    }
                }
        })
    ],

    session:{ 
        strategy:"jwt",
    },
    callbacks:{
        // This signIn callback is correct, no changes needed.
        async signIn({user,account,profile}){
            if (account?.provider == "google") {
                    await connectDB(); 
                    const existingUser = await User.findOne({email:user.email})
                    if(!existingUser) {
                        await User.create({
                            email:user.email,
                            name:user.name,
                            provider:"google",
                            emailVerified:true,
                            image:user.image,
                            role:"user"
                        })
                    }
            }
            return true;
        },

        // --- THIS IS THE CORRECTED CALLBACK ---
        async jwt({ token, user }){
            // The `user` object is only available on the first sign-in.
            if (user) {
                await connectDB();
                // Find the user in YOUR database using the email from the provider.
                const dbUser = await User.findOne({ email: user.email });

                if (dbUser) {
                    // Persist the MongoDB `_id` and role to the token.
                    token.id = dbUser._id.toString();
                    token.role = dbUser.role;
                }
            }
            return token;
        },

        // This session callback is now correct because `token.id` will always be the MongoDB _id.
        async session({ session, token }){
            if (session.user) {
                session.user.id = token.id as string;
                session.user.role = token.role as string;
            }
            return session;
        }
    },

    pages:{
        signIn:"/auth/signin",
    },
    secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };