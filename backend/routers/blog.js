// routes/blog.js
const express = require("express");
const router = express.Router();
const Blog = require("../model/blog");
const { isloggedin, isThisAdmin } = require("../middleware");

// GET route to retrieve all blog posts
router.get("", async (req, res) => {
    try {
        let blogs = await Blog.find({});
        res.status(200).send(blogs);
    } catch (error) {
        res.status(500).send({ message: "Error retrieving blog posts", error });
    }
});

router.get("/:id/edit",isloggedin,isThisAdmin, async (req, res) => {
    try {
        const { id } = req.params;
        const blogData = await Blog.findById(id);
        console.log(blogData);

        if (!blogData) {
            return res.status(404).json({ status: 404, message: "Blog not found" });
        }

        res.json({ status: 200, data: blogData }); // Ensure data is returned in the `data` property
    } catch (e) {
        res.status(500).json({ status: 500, message: e.message });
    }
});


// POST route to add a new blog post
router.post("",isloggedin, isThisAdmin, async (req, res) => {
    const { title, description, tag, imageLink  } = req.body;
    console.log(imageLink);
    if (!title || !description || !tag || !imageLink) {
        return res.status(400).send({ message: "All fields are required" });
    }

    try {
        const newBlog = new Blog({
            title,
            description,
            tag,
            urltoimage1 : imageLink,
        });

        await newBlog.save();
        res.status(201).send(newBlog);
    } catch (error) {
        res.status(500).send({ message: "Error adding the blog post", error });
    }
});

router.put("/:id", isloggedin, isThisAdmin, async (req, res) => {
    console.log("hello");
    try {
        const { id } = req.params;
        const blogData = req.body;  // No need to destructure req.body.event if event data is sent directly
  
        // Use findByIdAndUpdate to update the event
        const updatedBlog = await Blog.findByIdAndUpdate(id, blogData, { new: true });
  
        // Check if the Blog was found and updated
        if (!updatedBlog) {
            return res.status(404).json({ status: 404, message: "Blog not found" });
        }
  
        // Return a success response
        res.json({ status: 200, message: "Blog is updated", blog: updatedBlog });
    } catch (e) {
        console.error(e);
        res.status(500).json({ status: 500, message: e.message });
    }
  });

//deleting
router.delete("/:id/delete", isloggedin, isThisAdmin, async (req, res) => {
    const { id } = req.params;
    let data = await Blog.findByIdAndDelete(id);
    res.json({"status" : 200, "message" : "event has been deleted by admin"})
})

module.exports = router;
