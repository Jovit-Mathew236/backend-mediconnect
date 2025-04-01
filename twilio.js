require('dotenv').config();
const { db } = require('./firebase');
const { collection, addDoc, Timestamp } = require('firebase/firestore');

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require('twilio')(accountSid, authToken);

const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};
console.log(process.env.MessagingServiceSid)
const sendSms = async (phone) => {
    const otp = generateOTP();
    const otpMessage = `Your OTP is: ${otp}. Valid for 5 minutes.`;

    try {
        // Format phone number if needed
        const formattedPhone = phone.startsWith('+') ? phone : `+${phone}`;
        
        // Use MessagingServiceSid instead of from number
        const twilioResponse = await client.messages.create({
            body: otpMessage,
            // from: process.env.TWILIO_FROM_NUMBER,
            messagingServiceSid: process.env.MessagingServiceSid,
            to: formattedPhone
        });

        // Store OTP in Firebase
        const otpDoc = await addDoc(collection(db, 'otp_verification'), {
            phone: formattedPhone,
            otp: otp,
            createdAt: Timestamp.now(),
            expiryTime: Timestamp.fromDate(new Date(Date.now() + 5 * 60 * 1000)),
            status: 'pending',
            attempts: 0,
            messageId: twilioResponse.sid
        });

        return {
            success: true,
            messageId: twilioResponse.sid,
            otpId: otpDoc.id
        };
    } catch (error) {
        console.error('Twilio Error:', error);
        throw error;
    }
};

module.exports = sendSms;