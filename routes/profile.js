const express = require('express')
const router = express.Router();
const Users = require('../models/Users');

router.get('/specificprofile/:id',async (req, res) => {
    const { id } = req.params;
    const profile = await Users.findById(id);
    if (profile) {
      res.status(200).json(profile);
    } else {
      res.status(404).json({ message: "Profile not found" });
    }
  });
  
  // Route to update a profile
  router.put('/update/:id', async (req, res) => {
    try {
      // Fetch the existing profile
      const existingProfile = await Users.findById(req.params.id);
      if (!existingProfile) {
        return res.status(404).json({ message: "Profile not found" });
      }
  
      // Merge the existing profile data with the new data from the request body
      const updatedProfileData = {
        ...existingProfile.toObject(), // Convert Mongoose document to plain JavaScript object
        ...req.body // Merge with new data from the request body
      };
  
      // Update the profile in the database
      const updatedProfile = await Users.findByIdAndUpdate(req.params.id, updatedProfileData, { new: true });
  
      // Check if the profile was updated successfully
      if (updatedProfile) {
        res.status(200).json({ message: "Profile updated successfully", profile: updatedProfile });
      } else {
        res.status(404).json({ message: "Profile not found" });
      }
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  
  


module.exports = router;