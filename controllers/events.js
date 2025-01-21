const { response } = require("express");
const Event = require("../models/Event.model");

const getEvents = async (req, resp = response) => {
    const events = await Event.find().populate("user", "name");

    resp.json({
        ok: true,
        events
    });
};

const createEvent = async (req, resp = response) => {
    const event = new Event(req.body);
    try {
        event.user = req.uid;

        const eventDB = await event.save();

        resp.json({
            ok: true,
            event: eventDB
        });
    } catch (error) {
        console.log(error);
        resp.status(500).json({
            ok: false,
            msg: "Hable con el administrador"
        })
    }
};

const updateEvent = async (req, resp = response) => {
    const eventId = req.params.id

    try {
        const event = await Event.findById(eventId);
        const uid = req.uid;

        if (!event) {
            return resp.status(404).json({
                ok: false,
                msg: "El evento no fue encontrado"
            });
        }

        if (event.user.toString() !== uid) {
            return resp.status(401).json({
                ok: false,
                msg: "El usuario no tiene privilegios de actualizar el evento"
            });
        }

        const newEvent = {
            ...req.body,
            user: uid
        }

        const updatedEvent = await Event.findByIdAndUpdate(eventId, newEvent, {
            new: true
        });

        resp.json({
            ok: true,
            event: updatedEvent
        });
    } catch (error) {
        console.log(error);
        resp.status(500).json({
            ok: false,
            msg: "Contacte al administrador"
        });
    }
};

const deleteEvent = async(req, resp = response) => {
    const eventId = req.params.id

    try {
        const event = await Event.findById(eventId);
        const uid = req.uid;

        if (!event) {
            return resp.status(404).json({
                ok: false,
                msg: "El evento no fue encontrado"
            });
        }

        if (event.user.toString() !== uid) {
            return resp.status(401).json({
                ok: false,
                msg: "El usuario no tiene privilegios de eliminar el evento"
            });
        }

        await Event.findByIdAndDelete(eventId);

        resp.json({
            ok: true
        });
    } catch (error) {
        console.log(error);
        resp.status(500).json({
            ok: false,
            msg: "Contacte al administrador"
        });
    }
};

module.exports = {
    getEvents,
    createEvent,
    updateEvent,
    deleteEvent
}