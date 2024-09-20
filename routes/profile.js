const express = require('express');
const multer = require('multer');
const sharp = require('sharp');
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
      console.log("updation")
      console.log("input :",req.body)
    try {
      // Fetch the existing profile
      const existingProfile = await Users.findById(req.params.id);
      if (!existingProfile) {
        return res.status(404).json({ message: "Profile not found" });
      }
      const updatedProfileData = {
        ...existingProfile.toObject(), 
        ...req.body 
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
      console.log("error occured update profile :",error.message)
    }
  });
  
  // Upload Profile Photo

  const photoStorage = multer.memoryStorage();

  const photoUpload = multer({
    storage: photoStorage,
    limits: { fileSize: 1024 * 1024 * 5 }, // 5MB limit (adjust as needed)
  }).single('photo');
  
  router.post('/uploadphoto/:id', (req, res) => {
    photoUpload(req, res, async function (err) {
      if (err instanceof multer.MulterError && err.code === 'LIMIT_FILE_SIZE') {
        return res.status(202).json({ error: 'File too large. Please upload a file smaller than 5MB.' });
      } else if (err) {
        return res.status(204).json({ error: 'Failed to upload photo' });
      }
  
      try {
        const { id } = req.params;
        const user = await Users.findById(id);
        if (!user) {
          return res.status(404).json({ error: 'User not found' });
        }
  
        // Validate uploaded file type
        if (!req.file.mimetype.startsWith('image/')) {
          return res.status(203).json({ error: 'Invalid file type. Please upload an image.' });
        }
  
        try {
          const buffer = await sharp(req.file.buffer)
            .resize({ width: 300 })
            .toFormat('jpeg')
            .jpeg({ quality: 90 })
            .toBuffer();
  
          const photoFileName = `${user.name.replace(/\s+/g, '_')}_photo_${Date.now()}.jpeg`;
          const photoFilePath = path.join('photouploads', photoFileName);
  
          // Ensure the directory exists
          if (!fs.existsSync('photouploads')) {
            fs.mkdirSync('photouploads', { recursive: true });
          }
  
          // Save the processed image to the file system (consider cloud storage)
          fs.writeFileSync(photoFilePath, buffer);
  
          // Delete the old photo if it exists
          if (user.photoPath && fs.existsSync(user.photoPath)) {
            fs.unlinkSync(user.photoPath);
          }
  
          user.photoName = photoFileName;
          user.photoPath = photoFilePath;
          await user.save();
  
          res.status(201).json({ message: 'Photo uploaded successfully' });
        } catch (error) {
          console.error('Error processing image:', error);
          return res.status(500).json({ error: 'Failed to process photo' });
        }
      } catch (error) {
        console.error('Error uploading photo:', error);
        res.status(500).json({ error: 'Internal server error' });
      }
    });
  });
  
  
  router.get('/profilepic/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const user = await Users.findById(id);
      if (!user) {
        return res.status(204).json({ error: 'User not found' });
      }
  
      const photoPath = user.photoPath;
  
      if (!photoPath || !fs.existsSync(photoPath)) {
        return res.status(203).json({ error: 'Profile picture not found' });
      }
  
      const contentType = 'image/' + path.extname(photoPath).slice(1);
      res.setHeader('Content-Type', contentType);
  
      const readStream = fs.createReadStream(photoPath);
      readStream.pipe(res);
    } catch (error) {
      console.error('Error fetching profile picture:', error);
      res.status(500).json({ error: 'Internal server error' });
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
  filename: async (req, file, cb) => {
    try {
      const userId = req.params.id;
      const user = await Users.findById(userId);
      if (!user) {
        return cb(new Error('User not found'), null);
      }

      const username = user.name; 
      const currentDate = new Date();
      const formattedDate = currentDate.toISOString().split('T')[0];
      const fileName = `${username}_${formattedDate}_${file.originalname}`;

      cb(null, fileName);
    } catch (error) {
      cb(error, null);
    }
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

    // Delete the old CV file if it exists
    if (user.cvpath && fs.existsSync(user.cvpath)) {
      fs.unlinkSync(user.cvpath);
    }

    // Update user with new CV details
    user.cvname = cvFileName;
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
    const user = await Users.findById(fileId);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (user.cvname && user.cvname.trim() !== "") {
      const filePath = `uploads/${user.cvname}`;
      
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      } else {
        return res.status(206).send("File already deleted");
      }
      
      user.cvname = "";
      user.cvpath = "";
      await user.save();
      res.status(204).send();
    } else {
      res.status(205).send("CV not found");
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
         user.firstLogin = false;
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

// handle employment 
router.post('/employment/:id',async (req, res) => {
  
  const    employment  = req.body;
  const { id } = req.params;
  console.log("req :",employment)
 
  try {
    const user = await Users.findById(id)
    
    if(user){
         user.employment.push(employment);
         if (employment.isCurrent == true){
          user.currentCompany = employment.currentCompanyName
          await user.save()
         }
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
  
    const finduser = await Users.findById(userId)
    
    const user = await Users.findOneAndUpdate(
      { _id: userId, 'employment._id': employmentId }, 
      { $set: { 'employment.$': updatedEmploymentData } },
      { new: true }
    );
   if (updatedEmploymentData.isCurrent == true){
    finduser.currentCompany = updatedEmploymentData.currentCompanyName
    await finduser.save()
   }
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