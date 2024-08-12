const twilio = require('twilio');

const accountSid = 'your_account_sid'; // Replace with your Twilio Account SID
const authToken = 'your_auth_token'; // Replace with your Twilio Auth Token
const client = twilio(accountSid, authToken);

const sendSMS = (to, body) => {
    client.messages.create({
        body: body,
        from: 'your_twilio_phone_number', // Replace with your Twilio phone number
        to: to
    })
    .then(message => console.log(`SMS sent: ${message.sid}`))
    .catch(error => console.log(error));
};

module.exports = sendSMS;
