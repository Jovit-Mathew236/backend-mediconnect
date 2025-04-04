require("dotenv").config();
const express = require("express");
const { db } = require("./firebase");
const {
  doc,
  getDoc,
  updateDoc,
  Timestamp,
  query,
  where,
  collection,
  getDocs,
} = require("firebase/firestore");
const sendSms = require("./twilio");
const cors = require("cors");

const app = express();
app.use(cors()); // Enable CORS for all routes
// ... existing code ...
app.use(express.json());
app.get("/", (req, res) => {
  res.send("Hello World");
});
// Send OTP endpoint
app.post("/api/send-otp", async (req, res) => {
  try {
    const { phone } = req.body;
    if (!phone) {
      return res.status(400).json({ error: "Phone number is required" });
    }

    const result = await sendSms(phone);
    res.json({
      success: true,
      message: "OTP sent successfully",
      otpId: result.otpId,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// Verify OTP endpoint
app.post("/api/verify-otp", async (req, res) => {
  try {
    const { phone, otp } = req.body;
    if (!phone || !otp) {
      return res.status(400).json({ error: "Phone and OTP are required" });
    }

    // Query the latest OTP for this phone number
    const otpQuery = query(
      collection(db, "otp_verification"),
      where("phone", "==", phone),
      where("status", "==", "pending")
    );

    const querySnapshot = await getDocs(otpQuery);
    if (querySnapshot.empty) {
      return res.status(400).json({ error: "No pending OTP found" });
    }

    const otpDoc = querySnapshot.docs[0];
    const otpData = otpDoc.data();

    // Check if OTP is expired
    if (otpData.expiryTime.toDate() < new Date()) {
      await updateDoc(doc(db, "otp_verification", otpDoc.id), {
        status: "expired",
      });
      return res.status(400).json({ error: "OTP has expired" });
    }

    // Verify OTP
    if (otpData.otp !== otp) {
      const attempts = (otpData.attempts || 0) + 1;
      await updateDoc(doc(db, "otp_verification", otpDoc.id), {
        attempts: attempts,
        status: attempts >= 3 ? "blocked" : "pending",
      });
      return res.status(400).json({ error: "Invalid OTP" });
    }

    // OTP is valid
    await updateDoc(doc(db, "otp_verification", otpDoc.id), {
      status: "verified",
      verifiedAt: Timestamp.now(),
    });

    res.json({
      success: true,
      message: "OTP verified successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
