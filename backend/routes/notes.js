const express = require("express");
const Note = require("../Models/Note");
const router = express.Router();
var fetchuser = require("../middleware/fetchuser");
const { body, validationResult } = require("express-validator");

//ROUTE 1: Get All the notes Using: Get "api/notes/fetchallnotes"....login required
router.get("/fetchallnotes", fetchuser, async (req, res) => {
  try {
    const notes = await Note.find({
      user: req.user.id,
    });
    res.json(notes);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Occured");
  }
});

//ROUTE 2: Add a note Using: Post "api/notes/addnote"....login required
router.post(
  "/addnote",
  fetchuser,
  [
    body("title", "Enter a Valid title").isLength({
      min: 3,
    }),
    body("description", "Description must be atleast 5 characters").isLength({
      min: 5,
    }),
  ],
  async (req, res) => {
    try {
      const { title, description, tag, user } = req.body;
      // if there are errors then , return bad request and the errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          errors: errors.array(),
        });
      }
      const note = new Note({
        title,
        description,
        tag,
        user: req.user.id,
      });
      const savedNote = await note.save();
      res.json(savedNote);
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal Server Occured");
    }
  }
);

//ROUTE 3: Update an existing note Using: PUT "api/notes/updatenote"....login required
router.put("/updatenote/:id", fetchuser, async (req, res) => {
  const { title, description, tag } = req.body;
  try {
    //Create a New Note Object
    const newNote = {};
    if (title) {
      newNote.title = title;
    }
    if (description) {
      newNote.description = description;
    }
    if (tag) {
      newNote.tag = tag;
    }

    //Find the Note to be updated and Update it
    let note = await Note.findById(req.params.id);
    if (!note) {
      return res.status(404).send("Not Found");
    }

    // Allow Updation if the user owns this note
    if (note.user.toString() !== req.user.id) {
      return res.status(401).send("Not Allowed");
    }
    note = await Note.findByIdAndUpdate(
      req.params.id,
      {
        $set: newNote,
      },
      {
        new: true,
      }
    );
    res.json({
      note,
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Occured");
  }
});

//ROUTE 4: Delete an existing note Using: DELETE "api/notes/deletenote"....login required
router.delete("/deletenote/:id", fetchuser, async (req, res) => {
  try {
    //Find the Note to be deleted and delete it
    let note = await Note.findById(req.params.id);
    if (!note) {
      return res.status(404).send("Not Found");
    }

    // Allow Deletion if the user owns this note
    if (note.user.toString() !== req.user.id) {
      return res.status(401).send("Not Allowed");
    }
    note = await Note.findByIdAndDelete(req.params.id);
    res.json({
      Success: "Your Note has been Deleted",
      note: note,
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Occured");
  }
});

module.exports = router;
