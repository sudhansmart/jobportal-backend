const express = require('express');
const multer = require('multer');
const router = express.Router();
const Users = require('../models/Users');
const fs = require('fs');
const path = require('path');
const contentDisposition = require('content-disposition');

router.get('/allprofiles',async (req, res) => {
   
  const profile = await Users.find();
 
  if (profile) {
    res.status(200).json(profile);
  } else {
    res.status(404).json({ message: "Profile not found" });
  }
});

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
    console.log("upload triggerd : ",req.body)
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
  
// upload cv route 
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = 'uploads/';
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const currentDate = new Date();
    const formattedDate = currentDate.toISOString().split('T')[0];
    const fileName = `${formattedDate}_${file.originalname}`;
    cb(null, fileName);
  },
  
});

const upload = multer({ storage });

router.post('/uploadcv/:id', upload.single('file'), async (req, res) => {
  try {
    const { id } = req.params;
    const { filename: cvFileName, path: cvFilePath } = req.file;

    const user = await Users.findById(id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    user.cvname = cvFileName
    user.cvpath = cvFilePath;
    await user.save();

    res.status(201).json({ message: 'CV uploaded successfully' });
  } catch (error) {
    console.error('Error uploading CV:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// handle download 
router.get('/download/:candidateId', async (req, res) => {
  try {
    const { candidateId } = req.params;
    const candidate = await Users.findById(candidateId);
    console.log("candi :",candidate)

    if (!candidate) {
      return res.status(404).json({ message: 'Candidate not found' });
    }
   
    const filePath = candidate.cvpath;
    console.log("candi filepath :",filePath)

    if (!filePath || filePath.trim() === '') {
      return res.status(404).json({ message: 'CV not found. Please upload.' });
    }
    const candidateName = candidate.name.replace(/\s+/g, '_'); // Replace whitespace with underscores
    const fileName = `${candidateName}_CV.pdf`;
    res.setHeader('Content-Disposition', contentDisposition(fileName));
    res.setHeader('Content-Type', 'application/pdf');

    // Create a readable stream from the file and pipe it to the response
    const fileStream = fs.createReadStream(filePath);
    fileStream.pipe(res);
   
  } catch (error) {
    console.error('Error occurred in Download Route:', error.message);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
});

router.delete('/delete/:Id', async (req, res) => {
  const fileId = req.params.Id;
  
  try {
    const user = await Users.findById(fileId)
     
     if(user.cvname !== " "){
          fs.unlinkSync(`uploads/${user.cvname}`);
      user.cvname =  " "
      user.cvpath = " "
      await user.save();
      res.status(204).send();
     }
   else if( user.cvname == " "){
    res.status(205).send("Cv not found ")
   }
   
 
 
  } catch (error) {
    console.error('Error deleting file:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});
  
// handle summary 
router.post('/summary/:id',async (req, res) => {
  const { summary } = req.body;
  const { id } = req.params;
  try {
    const user = await Users.findById(id)
    if(user){
         user.profileSummary = summary

         await user.save();
         res.status(201).send("Summary Saved")
    }
    if(!user){
      res.status(202).send("Profile not found")
     
 }
    
  } catch (error) {
    console.log("error occured in summary :",error.message)
  }
});

// handle Skills 
router.post('/skills/:id',async (req, res) => {
  const { skills } = req.body;
  const { id } = req.params;
  try {
    const user = await Users.findById(id)
    if(user){
         user.keySkills = skills

         await user.save();
         res.status(201).send("Skills Saved")
    }
    if(!user){
      res.status(202).send("Profile not found")
     
 }
    
  } catch (error) {
    console.log("error occured in skills :",error.message)
  }
});

// handle education 
router.post('/education/:id',async (req, res) => {
  
  const    education  = req.body;
  const { id } = req.params;
  try {
    const user = await Users.findById(id)
    if(user){
         user.education.push(education);
         await user.save();

       
         res.status(201).send("Education Saved")
    }
    if(!user){
      res.status(202).send("Profile not found")
     
 }
    
  } catch (error) {
    console.log("error occured in post Education :",error.message)
  }
});


router.put('/education/:userId/:educationId', async (req, res) => {
  try {
    const { userId, educationId } = req.params;
    const updatedEducationData = req.body; 

   
    const user = await Users.findOneAndUpdate(
      { _id: userId, 'education._id': educationId }, 
      { $set: { 'education.$': updatedEducationData } },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ error: 'User not found or education not found in the user' });
    }

    res.json(user); 
  } catch (error) {
    console.error('Error updating education data:', error);
    res.status(500).json({ error: 'Error updating education data' });
  }
});

router.delete('/deleteeducation/:userId/:educationId', async (req, res) => {
  try {
    const { userId, educationId } = req.params
    const user = await Users.findById(userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    user.education = user.education.filter(edu => edu._id.toString() !== educationId);

   
    await user.save();

    res.json(user); 
  } catch (error) {
    console.error('Error deleting education data:', error);
    res.status(500).json({ error: 'Error deleting education data' });
  }
});

// handle Language Data

router.post('/language/:id',async (req, res) => {
  
  const    newLanguage  = req.body;
  const { id } = req.params;
  
  try {
    const user = await Users.findById(id)
    if(user){
         user.languages.push(newLanguage);
         await user.save();

       
         res.status(201).send("Language Saved")
    }
    if(!user){
      res.status(202).send("Profile not found")
     
 }
    
  } catch (error) {
    console.log("error occured in Language :",error.message)
  }
});

router.delete('/deletelanguage/:userId/:languageId', async (req, res) => {
  try {
    const { userId, languageId } = req.params
    const user = await Users.findById(userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    user.languages = user.languages.filter(lang => lang._id.toString() !== languageId);

   
    await user.save();

    res.json(user); 
  } catch (error) {
    console.error('Error deleting education data:', error);
    res.status(500).json({ error: 'Error deleting education data' });
  }
});

// handle education 
router.post('/employment/:id',async (req, res) => {
  
  const    employment  = req.body;
  const { id } = req.params;
  try {
    const user = await Users.findById(id)
    if(user){
         user.employment.push(employment);
         await user.save();

       
         res.status(201).send("Employment Saved")
    }
    if(!user){
      res.status(202).send("Profile not found")
     
 }
    
  } catch (error) {
    console.log("error occured in post Employment :",error.message)
  }
});

router.delete('/deleteemployment/:userId/:employmentId', async (req, res) => {
  try {
    const { userId, employmentId } = req.params
    const user = await Users.findById(userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    user.employment = user.employment.filter(work => work._id.toString() !== employmentId);

   
    await user.save();

    res.json(user); 
  } catch (error) {
    console.error('Error deleting employment data:', error);
    res.status(500).json({ error: 'Error deleting employment data' });
  }
});

router.put('/employment/:userId/:employmentId', async (req, res) => {
  try {
    const { userId, employmentId } = req.params;
    const updatedEmploymentData = req.body; 
  
   
    const user = await Users.findOneAndUpdate(
      { _id: userId, 'employment._id': employmentId }, 
      { $set: { 'employment.$': updatedEmploymentData } },
      { new: true }
    );
   
    if (!user) {
      return res.status(404).json({ error: 'User not found or employment not found in the user' });
    }

    res.json(user); 
  } catch (error) {
    console.error('Error updating employment data:', error);
    res.status(500).json({ error: 'Error updating employment data' });
  }
});


module.exports = router;