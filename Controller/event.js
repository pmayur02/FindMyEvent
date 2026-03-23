const eventService = require("../Services/event");
const {sendSuccess, sendError} = require("../Utilities/utils")

module.exports.createEvent= async (req, res, next) => {
  try {
    const payload = {userId:req.user.id, ...req.body}
    const result = await eventService.createEvent(payload);
    if(result?.status === 200 || result?.status === 201){
        sendSuccess(res,result?.data, result.message, result.status)
    }else{
        sendError(res,result?.message, result?.status,result?.error) 
    }

  } catch (error) {
    console.error('Event Register error:', error.message);
    next(error);
  }
};

module.exports.fetchAllEvents= async (req, res, next) => {
  try {

    const result = await eventService.fetchAllEvents(req);
    if(result?.status === 200 || result?.status === 201){
        sendSuccess(res,result?.data, result.message, result.status)
    }else{
        sendError(res,result?.message, result?.status,result?.error) 
    }

  } catch (error) {
    console.error('Event Register error:', error.message);
    next(error);
  }
};

module.exports.fetchEvent= async (req, res, next) => {
  try {

    const eventId = req.params.id
    const result = await eventService.fetchEvent(eventId);
    if(result?.status === 200 || result?.status === 201){
        sendSuccess(res,result?.data, result.message, result.status)
    }else{
        sendError(res,result?.message, result?.status,result?.error) 
    }

  } catch (error) {
    console.error('Event Register error:', error.message);
    next(error);
  }
};

module.exports.updateEvent= async (req, res, next) => {
  try {

    const eventId = req.params.id;
    const userId = req.user.id;
    const result = await eventService.updateEvent(eventId,userId,req.body);
    if(result?.status === 200 || result?.status === 201){
        sendSuccess(res,result?.data, result.message, result.status)
    }else{
        sendError(res,result?.message, result?.status,result?.error) 
    }

  } catch (error) {
    console.error('Event Register error:', error.message);
    next(error);
  }
};

module.exports.deleteEvent= async (req, res, next) => {
  try {

    const eventId = req.params.id
    const userId = req.user.id
    const result = await eventService.deleteEvent(eventId,userId);
    if(result?.status === 200 || result?.status === 201){
        sendSuccess(res,result?.data, result.message, result.status)
    }else{
        sendError(res,result?.message, result?.status,result?.error) 
    }

  } catch (error) {
    console.error('Event Register error:', error.message);
    next(error);
  }
};

module.exports.bookTicket= async (req, res, next) => {
  try {

    const userId = req.user.id
    const result = await eventService.bookTicket(userId,req.body);
    if(result?.status === 200 || result?.status === 201){
        sendSuccess(res,result?.data, result.message, result.status)
    }else{
        sendError(res,result?.message, result?.status,result?.error) 
    }

  } catch (error) {
    console.error('Event Register error:', error.message);
    next(error);
  }
};

module.exports.myTickets= async (req, res, next) => {
  try {

    const userId = req.user.id
    const result = await eventService.myBookedTickets(userId);
    if(result?.status === 200 || result?.status === 201){
        sendSuccess(res,result?.data, result.message, result.status)
    }else{
        sendError(res,result?.message, result?.status,result?.error) 
    }

  } catch (error) {
    console.error('Event Register error:', error.message);
    next(error);
  }
};


module.exports.attendanceTrack= async (req, res, next) => {
  try {

    const ticketId = req.params.ticketId
    const userId = req.user.id
    const result = await eventService.attendanceTrack(userId,ticketId);
    if(result?.status === 200 || result?.status === 201){
        sendSuccess(res,result?.data, result.message, result.status)
    }else{
        sendError(res,result?.message, result?.status,result?.error) 
    }

  } catch (error) {
    console.error('Event Register error:', error.message);
    next(error);
  }
};

module.exports.getUpcomingEvents= async (req, res, next) => {
  try {

    const result = await eventService.getUpcomingEvents(req);
    if(result?.status === 200 || result?.status === 201){
        sendSuccess(res,result?.data, result.message, result.status)
    }else{
        sendError(res,result?.message, result?.status,result?.error) 
    }

  } catch (error) {
    console.error('Event Register error:', error.message);
    next(error);
  }
};