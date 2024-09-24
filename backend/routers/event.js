const express = require("express");
const Event = require("../model/event.js");

const { isThisAdmin, isloggedin } = require("../middleware");
const router = express.Router();

//************* for event**********/
//index route
router.get('/', async (req, res) => {
    try {
      const events = await Event.find({});
      res.json({ status: 200, events });
    } catch (error) {
      res.status(500).json({ status: 500, message: "Failed to fetch events" });
    }
  });

//rendering for creating new event
router.get("/new",isloggedin ,isThisAdmin, async (req, res) => {
    res.json({ "staus": 500, "message": "add new event" });
})

const validateEventData = (data) => {
    const { title, description, tag, posterlink, eventMonth, eventDay, eventTime, coordinator } = data;
    if (!title || !description || !eventMonth || !eventDay || !eventTime) {
      return false;
    }
    return true;
  };
  
  router.post('/', isloggedin, isThisAdmin, async (req, res) => {
    try {
      if (!validateEventData(req.body)) {
        return res.status(400).json({ status: 400, message: "Invalid event data" });
      }
      
      let eventData = new Event(req.body);
      await eventData.save();
      console.log("Event saved:", eventData);
      res.json({ status: 200, message: "Added new event" });
    } catch (error) {
      console.error("Error saving event:", error);
      res.status(500).json({ status: 500, message: "Failed to add event" });
    }
  });

// editing event
router.get("/:id/edit", isloggedin, isThisAdmin, async (req, res) => {
    try {
        const { id } = req.params;
        const eventData = await Event.findById(id);
        console.log(eventData);

        if (!eventData) {
            return res.status(404).json({ status: 404, message: "Event not found" });
        }

        res.json({ status: 200, event: eventData });
    } catch (e) {
        res.status(500).json({ status: 500, message: e.message });
    }
});

// updating
router.put("/:id", isloggedin, isThisAdmin, async (req, res) => {
  try {
      const { id } = req.params;
      const eventData = req.body;  // No need to destructure req.body.event if event data is sent directly

      // Use findByIdAndUpdate to update the event
      const updatedEvent = await Event.findByIdAndUpdate(id, eventData, { new: true });

      // Check if the event was found and updated
      if (!updatedEvent) {
          return res.status(404).json({ status: 404, message: "Event not found" });
      }

      // Return a success response
      res.json({ status: 200, message: "Event is updated", event: updatedEvent });
  } catch (e) {
      console.error(e);
      res.status(500).json({ status: 500, message: e.message });
  }
});


//deleting
router.delete("/:id/delete", isloggedin, isThisAdmin, async (req, res) => {
    const { id } = req.params;
    let data = await Event.findByIdAndDelete(id);
    res.json({"status" : 200, "message" : "event has been deleted by admin"})
})

module.exports = router;