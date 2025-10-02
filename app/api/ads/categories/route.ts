
import { connectDB } from "@/lib/db";
import Ad from "@/models/Ad";
import { NextRequest, NextResponse } from "next/server";

// A public GET endpoint to fetch all unique, existing categories.
export async function GET(req: NextRequest) {
  try {
    await connectDB();

    // 1. Use the `distinct()` method to get an array of unique values
    //    from the 'category' field. We only search in 'available' ads.
    const categories = await Ad.distinct("category", { status: 'available' });

    // 2. The result is an array of strings, e.g., ["Tech", "Crypto", "Gaming"]
    //    We will sort them alphabetically for a better user experience.
    const sortedCategories = categories.sort();

    return NextResponse.json(sortedCategories, { status: 200 });
  } catch (error) {
    console.error("Error fetching categories:", error);
    return NextResponse.json(
      { message: "An internal server error occurred" },
      { status: 500 }
    );
  }
}