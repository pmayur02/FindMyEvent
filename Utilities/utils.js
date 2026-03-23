const jwt = require("jsonwebtoken");


module.exports.generateToken =(tokenData)=>{
    return jwt.sign(tokenData,process.env.SECRET_KEY);
}


module.exports.sendSuccess = (res, data, message = 'Success', statusCode = 200) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data
  });
};

module.exports.sendError = (res, message = 'Something went wrong', statusCode = 500, errors = null) => {
  const response = {
    success: false,
    message
  };

  if (errors) {
    response.errors = errors;
  }

  return res.status(statusCode).json(response);
};


module.exports.isEventExpired= (event)=> {
  const { event_date, event_time } = event;

  // Split date
  const [day, month, year] = event_date.split('-').map(Number);

  // Split time
  const [hours, minutes] = event_time.split(':').map(Number);

  // Create a JS Date object
  const eventDateTime = new Date(year, month - 1, day, hours, minutes);

  // Compare with current time
  return eventDateTime < new Date(); // true if event has already passed
}



module.exports.generateTicketNo=(length = 20)=> {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * chars.length);
    result += chars[randomIndex];
  }
  return result;
}
