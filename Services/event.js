const { db } = require("../Connection/dbConnection");
const queries = require("../Connection/dbQueries/dbQueries.json");
const {isEventExpired,generateTicketNo} = require('../Utilities/utils')

module.exports.createEvent = async(payload)=>{
    try {
        const {title, description,event_date,event_time,total_capacity,userId} = payload;

        
        if(!title || !description || !event_date || !event_time || !total_capacity || !userId){
            return{
                status:400,
                message:"Missing Data"
            }
        }

        const remainingTickets = total_capacity;
        const event = await db.query(queries.createEvent,[title, description,event_date,event_time,total_capacity,remainingTickets,userId])
        if (!event[0].insertId) {
            return {
                status: 500,
                message: "Failed to Register User"
            }
        }

        return {
            status: 201,
            message: "event registered Successfully!"
        }

    } catch (error) {
                return {
            status: 500,
            message: "Something went wrong",
            error: error
        }
    }
}

module.exports.fetchAllEvents= async(_)=>{
    try {
        const allEvents = await db.query(queries.fetchAllEvents);
        if(!allEvents || allEvents[0].length ==0){
            return{
            status: 404,
                message:"No Events Found!"
            }
        }

        return{
            status:200,
            message:"Fetched all events",
            data:allEvents[0]
        }
    } catch (error) {
            return {
            status: 500,
            message: "Something went wrong",
            error: error
        }
    }
}

module.exports.fetchEvent= async(eventId)=>{
    try {
        if(!eventId){
            return {
                status:400,
                message:"Missing eventId"
            }
        }
        const event = await db.query(queries.fetchEvent,[eventId]);
        if(!event || event[0].length ==0){
            return{
            status: 404,
                message:"Event Not Found!"
            }
        }

        delete event[0][0].created_by

        return{
            status:200,
            message:"Fetched all events",
            data:event[0][0]
        }
    } catch (error) {
            return {
            status: 500,
            message: "Something went wrong",
            error: error
        }
    }
}

module.exports.updateEvent = async (eventId, userId, payload) => {
    try {
        if (!eventId || !userId || !payload || Object.keys(payload).length == 0) {
            return {
                status: 400,
                message: "missing payload",
            }
        }

        const isExist = await db.query(queries.fetchEvent, [eventId]);
        if (isExist[0]?.length === 0) {
            return {
                status: 404,
                message: "No Event Found",
            }
        }

        if(isExist[0][0].created_by !== userId){
            return {
                status:400,
                message:"you are not authorised for this operation"
            }
        }

        let updatePayloadFields = [];
        for (let [key, val] of Object.entries(payload)) {
             let string = ""

            string = key === "event_date" ? `${key} = STR_TO_DATE('${val}', '%d-%m-%Y') ` : `${key} ='${val}' ` 
            
            updatePayloadFields.push(string);
        }

        let payloadString = updatePayloadFields.join(",")
        const newQuery = queries.updateEvent.replace("{expr}", payloadString);

        const updatedStatus = await db.query(newQuery,[eventId]);
        if(!updatedStatus[0].affectedRows){
                        return {
                status: 500,
                message: "Failed to Update Event"
            }
        }

        return{
            status: 200,
            message: "Event Updated Successfully!",
        }
        

    } catch (error) {
        return {
            status: 500,
            message: "Something went wrong",
            error: error
        }
    }
}

module.exports.deleteEvent = async (eventId,userId) => {
    try {
        if (!eventId) {
            return {
                status: 400,
                message: "missing eventId",
            }
        }

        const isExist = await db.query(queries.fetchEvent, [eventId]);
        if (isExist[0]?.length === 0) {
            return {
                status: 404,
                message: "No Event Found",
            }
        }

        if(isExist[0][0].created_by !== userId){
            return {
                status:400,
                message:"you are not authorised for this operation"
            }
        }

        const deleteStatus = await db.query(queries.deleteEvent, [eventId]);
        if (!deleteStatus[0].affectedRows) {
            return {
                status: 500,
                message: "Failed to Delete Event"
            }
        }

        return {
            status: 200,
            message: "Event Deleted Successfully!",
        }

    } catch (error) {
        return {
            status: 500,
            message: "Something went wrong",
            error: error
        }
    }
}


module.exports.bookTicket = async(userId, payload) => {
    try {

        const connection = await db.getConnection();
        
        const {eventId, noOfTicket} = payload;

        if(!eventId || !noOfTicket || !userId){
            return {
                status: 400,
                message: "Missing Fields - eventId or noOfTickets or userId "
            }
        }

        // start transaction
        await connection.beginTransaction();

        let event = await connection.query(queries.fetchEvent + ' FOR UPDATE', [eventId]); // for update to lock the event row for other transaction
        
        if(!event || event[0].length === 0){
            await connection.rollback();
            connection.release();
            return {
                status: 404,
                message: "No Event Found",
            }
        }

        event = event[0][0];

        const isExpired = isEventExpired({event_date: event.event_date, event_time: event.event_time});
        if(isExpired){
            await connection.rollback();
            connection.release();
            return{
                status: 400,
                message: "Event already expired"
            }
        }

        if(noOfTicket > 10){
            await connection.rollback();
            connection.release();
            return{
                status: 400,
                message: "You can book upto 10 tickets"
            }
        }

        let availableTickets = event.remaining_tickets;
        if(availableTickets <= 0){
            await connection.rollback();
            connection.release();
            return{
                status: 400,
                message: "No Tickets Available"
            }
        }

        if(availableTickets < noOfTicket){
            await connection.rollback();
            connection.release();
            return{
                status: 400,
                message: `Cannot Book ${noOfTicket} number of tickets only ${availableTickets} tickets are available.`
            }
        }

        availableTickets = availableTickets - noOfTicket;

        if(availableTickets < 0) availableTickets = 0;

        const ticketNo = generateTicketNo();

        const bookingStatus = await Promise.allSettled([
            connection.query(queries.bookTicket, [ticketNo, userId, eventId, noOfTicket]),
            connection.query(queries.updateTicketCount, [availableTickets, eventId])
        ]);
  
        const insertId = bookingStatus[0].value[0].insertId;
        const bookingDetails = await connection.query(queries.fetchBookedTicket, [insertId]);

        if(!bookingDetails || bookingDetails[0].length === 0){
            await connection.rollback();
            connection.release();
            return{
                status: 404,
                message: "No ticket found"
            }
        }

        // commit transaction
        await connection.commit();
        connection.release();

        return {
            status: 201,
            message: "Ticket Booked Successfully!",
            data: bookingDetails[0][0]
        }

    } catch (error) {
        // rollback on error
        await connection.rollback();
        connection.release();
        
        return {
            status: 500,
            message: "Something went wrong",
            error: error
        } 
    }
}


module.exports.myBookedTickets = async(userId)=>{
    try {
        if(!userId){
            return{
                status:400,
                message:"Missing userId"
            }
        }

        const myBookedTickets = await db.query(queries.myBookedTickets,[userId]);
        if(!myBookedTickets || myBookedTickets[0].length ===0){
            return{
                status:404,
                message:"No tickets Booked Yet!"
            }
        }

        return{
            status:200,
            message:"Fetched your Tickets History",
            data: myBookedTickets[0]
        }
    } catch (error) {
                       return {
            status: 500,
            message: "Something went wrong",
            error: error
        } 
    }
}

module.exports.attendanceTrack = async(userId,ticketId)=>{
    try {
        if(!ticketId){
            return{
                status:400,
                message:"Ticket Id missing"
            }
        }

        let ticket = await db.query(queries.fetchTicketByTicketId,[ticketId]);
        if(!ticket || ticket[0].length === 0){
            return{
                status:404,
                message:"Ticket NOt Found."
            }
        }

        ticket = ticket[0][0];

        const isExpired = isEventExpired({event_date: ticket.event_date, event_time: ticket.event_time});
        if(isExpired){
            return{
                status:400,
                message:"Event already expired"
            }
        }

        const eventAttnStatus = await db.query(queries.insertAttendance,[userId,ticket.event_id,ticket.ticket_id])
        if (!eventAttnStatus[0]?.insertId) {
            return {
                status: 500,
                message: "Failed to Entry Attendance"
            }
        }

        return{
            status:201,
            message:"Attendance marked successfully."
        }


    } catch (error) {
                               return {
            status: 500,
            message: "Something went wrong",
            error: error
        } 
    }
}

module.exports.getUpcomingEvents = async(_)=>{
    try {
        const upComingEvents = await db.query(queries.getUpcomingEvents);
        if(upComingEvents[0].length === 0){
            return{
                status:404,
                message:"No Upcoming events."
            }
        }

        return{
            status:200,
            message:"Upcoming events fetched successfully.",
            data:upComingEvents[0]
        }
    } catch (error) {
                                       return {
            status: 500,
            message: "Something went wrong",
            error: error
        } 
    }
}