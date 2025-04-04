# SMS OTP Verification API

A Node.js API for sending and verifying OTP codes via SMS using Twilio.

## Features

- Send OTP to a phone number
- Verify OTP
- Firebase integration for OTP storage and verification

## Environment Variables

Create a `.env` file with the following variables:

```
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
MessagingServiceSid=your_twilio_messaging_service_sid
PORT=8080
```

## Local Development

```bash
# Install dependencies
npm install

# Start the server
npm start
```

## Deploying to Koyeb

1. Create a Koyeb account at https://koyeb.com
2. Install the Koyeb CLI
3. Login to the Koyeb CLI
   ```bash
   koyeb login
   ```
4. Create a new app
   ```bash
   koyeb app create mediconnect-api
   ```
5. Deploy the app using the Dockerfile
   ```bash
   koyeb service create --app mediconnect-api --name api --docker $GITHUB_REPO --docker-entrypoint "npm start" --port 8080 --env PORT=8080 --env TWILIO_ACCOUNT_SID=$TWILIO_ACCOUNT_SID --env TWILIO_AUTH_TOKEN=$TWILIO_AUTH_TOKEN --env MessagingServiceSid=$MESSAGING_SERVICE_SID
   ```

Alternatively, you can deploy directly from the Koyeb dashboard:

1. Connect your GitHub repository
2. Create a new service from the repository
3. Choose Docker as the deployment method
4. Set the environment variables in the dashboard
5. Deploy the service

## API Endpoints

### Send OTP

```
POST /api/send-otp
{
  "phone": "+1234567890"
}
```

### Verify OTP

```
POST /api/verify-otp
{
  "phone": "+1234567890",
  "otp": "123456"
}
```
