const eventRouter = require("express").Router();
const eventController = require("../Controller/event");
const {authenticateUser} = require("../Middlewares/authMiddleware")
const {validate} = require("../Middlewares/validate")
const {
  createEventValidation,
  updateEventValidation,
  eventIdValidation,
  bookTicketValidation,
  ticketIdValidation
} = require('../Utilities/validations');


eventRouter.post("/create-event",validate(createEventValidation, 'body'),authenticateUser,eventController.createEvent);
eventRouter.get("/fetch-event/:id",validate(eventIdValidation, 'params'),authenticateUser,eventController.fetchEvent);
eventRouter.get("/fetch-events",authenticateUser,eventController.fetchAllEvents);
eventRouter.patch("/update-event/:id", validate(eventIdValidation, 'params'), validate(updateEventValidation, 'body'),authenticateUser,eventController.updateEvent);
eventRouter.delete("/remove-event/:id",validate(eventIdValidation, 'params'),authenticateUser,eventController.deleteEvent);
eventRouter.post("/book-ticket/",validate(bookTicketValidation, 'body'),authenticateUser,eventController.bookTicket);
eventRouter.get("/mytickets/",authenticateUser,eventController.myTickets);
eventRouter.get("/mark-attendance/:ticketId",validate(ticketIdValidation, 'params'),authenticateUser,eventController.attendanceTrack);
eventRouter.get("/upcoming-events/",eventController.getUpcomingEvents);
module.exports = {eventRouter};