import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const { transaction_id, photo_id } = await request.json();

    if (!transaction_id || !photo_id) {
      return NextResponse.json(
        { error: "Transaction ID and Photo ID are required" },
        { status: 400 }
      );
    }

    // Verify payment with Flutterwave
    const verificationResponse = await fetch(
      `https://api.flutterwave.com/v3/transactions/${transaction_id}/verify`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${process.env.FLUTTERWAVE_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!verificationResponse.ok) {
      throw new Error("Failed to verify payment with Flutterwave");
    }

    const verificationData = await verificationResponse.json();

    if (
      verificationData.status === "success" &&
      verificationData.data.status === "successful"
    ) {
      // Payment is verified - now record the purchase in your database
      //   const purchase = await recordPurchase({
      //     transaction_id,
      //     photo_id,
      //     amount: verificationData.data.amount,
      //     currency: verificationData.data.currency,
      //     customer_email: verificationData.data.customer.email,
      //     flutterwave_data: verificationData.data,
      //   });

      //   // Generate download token or update user permissions
      //   const downloadToken = await generateDownloadToken(photo_id, purchase.id);

      return NextResponse.json({
        status: "success",
        message: "Payment verified successfully",
        // download_token: downloadToken,
        // purchase_id: purchase.id,
      });
    } else {
      return NextResponse.json(
        {
          status: "failed",
          message: "Payment verification failed",
          details: verificationData,
        },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("Payment verification error:", error);
    return NextResponse.json(
      { error: "Internal server error during payment verification" },
      { status: 500 }
    );
  }
}
