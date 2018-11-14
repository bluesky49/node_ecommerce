const twilioClient = require('twilio')(
  process.env.TWILIO_SID,
  process.env.TWILIO_AUTH
);

const companyNumber = '+12015094906';

exports.jobPostedMessage = (title, name, phone) => {
  twilioClient.messages
    .create({
      body: `Hello ${name}, Your shovel job: ${title} has been successfully published to ShovelPros!`,
      from: companyNumber,
      to: `${phone}`
    })
    .then(message => console.log('Message Status: ' + message.sid))
    .done();
};

exports.jobCompleted = (title, shoveleeName, shovelerName, phone) => {
  twilioClient.messages
    .create({
      body: `Hello ${shoveleeName}, Your shovel job: ${title} has been completed successfully by ${shovelerName}`,
      from: companyNumber,
      to: phone
    })
    .then(message => console.log('Job Completed Message: ' + message.sid))
    .done();
};

exports.accountUpdate = (name, phone) => {
  twilioClient.messages
    .create({
      body: `Your ShovelPros profile has been updated successfully ${name}`,
      from: companyNumber,
      to: `${phone}`
    })
    .then(message => console.log('Message Status: ' + message.sid))
    .done();
};

exports.shovelerAssigned = (shoveleeName, shovelerName, phone) => {
  twilioClient.messages
    .create({
      body: `Hello ${shoveleeName}, ${shovelerName} is on the way to your shovel job!`,
      from: companyNumber,
      to: phone
    })
    .then(message =>
      console.log('ShovelerAssigned Message Status: ' + message.sid)
    )
    .done();
};

exports.newBid = (shoveleeName, shovelerName, phone, listingURL) => {
  twilioClient.messages
    .create({
      body: `Hello ${shoveleeName}, A new bid by ${shovelerName} was made on your recent listing. You can view it by visiting this url: ${listingURL}`,
      from: companyNumber,
      to: `${phone}`
    })
    .then(message => console.log('New Bid Message Status: ' + message.sid))
    .done();
};
