import midtransClient from "midtrans-client";
import dotenv from "dotenv";
dotenv.config();

const snap = new midtransClient.Snap({
    isProduction: false,
    serverKey: process.env.MIDTRANS_SERVER_KEY,
    clientKey: process.env.MIDTRANS_CLIENT_KEY
});

const coreAPI = new midtransClient.CoreApi({
    isProduction: false,
    serverKey: process.env.MIDTRANS_SERVER_KEY,
    clientKey: process.env.MIDTRANS_CLIENT_KEY
})


export const createTransaction = async (req,res) => {
    try{
        const { amount, first_name, email } = req.body;

        const parameter = {
            transaction_details: {
                order_id: "ORDER-" + Date.now(),
                gross_amount: amount
            },
            credit_card: {
                secure: true
            },
            customer_details: {
                first_name,
                email
            }
        }

        const transaction = await snap.createTransaction(parameter);

        res.status(200).json({
            message: "Transaksi berhasil dibuat",
            token: transaction.token,
            redirect_url: transaction.redirect_url
        });

    }   catch (error){
        console.error("Error createTransaction:", error);
        res.status(500).json({ message: "Gagal membuat transaksi" });
    }
}

export const handleNotification = async (req, res) => {
    try {
        const notification = req.body;


        const statusResponse = await coreAPI.transaction.notification(notification);

        const orderID = statusResponse.order_id;
        const transactionStatus = statusResponse.transaction_status
        const fraudStatus = statusResponse.fraud_status;
        const paymentType = statusResponse.payment_type;

        console.log("Order ID:", orderID);
        console.log("Transaction Status:", transactionStatus);

        if  (transactionStatus === "capture") {
            if(fraudStatus === "accept") {
                console.log("Pembayaran berhasil (capture)")
            }
        }   else if (transactionStatus === "settlement") {
            console.log("Pembayaran berhasil (settlement)");
        }   else if (transactionStatus === "pending") {
            console.log("Menunggu pembayaran");
        }   else if (
            transactionStatus === "cancel" ||
            transactionStatus === "deny" ||
            transactionStatus === "expire"
           )   {
            console.log("Pembayaran gagal");
        }
        res.status (200).json({ message: "Notification handled", status: statusResponse});

    } catch (error) {
        console.error("Error handleNotification", error);
        res.status(500).json({ message: "Error handling notification"});
    }
};

export const checkStatus = async (req, res) => {
    try {
        const { orderID } = req.params;

        const statusResponse = await coreAPI.transaction.status(orderID);

        res.status(200).json({
            order_id: statusResponse.order_id,
            transaction_status: statusResponse.transaction_status,
            payment_type: statusResponse.payment_type,
            fraud_status: statusResponse.fraud_status
        });
    } catch (error) {
        console.error("Error checkStatus:", error);
        res.statusS(500).json({ message: "Gagal cek status transaksi"});
    }
}
