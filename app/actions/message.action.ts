"use server";

import { pusherServer } from "@/lib/pusher";
/* eslint-disable @typescript-eslint/no-explicit-any */



export const sendMessage = async (message: string) => {
  try {
    // Store the message inside ur db

    // 1
    pusherServer.trigger("chat-app", "upcoming-message", {
      message,
    });
  } catch (error: any) {
    throw new Error(error.message);
  }
};