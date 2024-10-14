const mongoose = require('mongoose');
const { format } = require('date-fns');
const { v4: uuid } = require('uuid');
const EventLog = require('../model/EventLog');

const logger = async (req,res,next) =>{
    const dateTime = format(new Date(), 'dd/MM/yyyy\tHH:mm:ss');
    const eventId = uuid();
    const message = `${req.method} \t ${req.headers.origin} \t ${req.url}`; //req.headers.orgin is the domain making the req
    //to store the new event
    try{
        const newEvent = await EventLog.create({
            eventId,
            timestamp: dateTime,
            message
        });
    }catch(err){
        console.error(err);
    }

    next();
}

module.exports = logger;