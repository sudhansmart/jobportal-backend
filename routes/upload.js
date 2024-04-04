const express = require('express');
const multer = require('multer');
const jwt = require("jsonwebtoken");
const router = express.Router();
const UploadedFile = require('../models/UploadedFiles');
const Users = require('../models/Users');
const fs = require('fs');
const path = require('path');
const contentDisposition = require('content-disposition');
const { sendMail } = require('../controllers/sendMail');

router.get('/getdata',async (req, res) => {
   
  const profile = await Users.find();
 
  if (profile) {
    res.status(200).json(profile);
  } else {
    res.status(404).json({ message: "Profile not found" });
  }
});

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = 'uploads/';
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});
const upload = multer({ storage });

// Upload Route
router.post('/upload', upload.single('file'), async (req, res) => {
  try {
    const file = req.file;
    const data = req.body;
    console.log("data :",data)
    const Payload = {name:data.name,email:data.email}
    const token = generateToken(Payload);
    const latestCandidate = await UploadedFile.findOne({}, {}, { sort: { serialId: -1 } });
    const checkUser =  await Users.findOne({email: data.email});
    const content = `<h2>Hello Job Seeker,</h2>
                      <h4>Welcome to Skylark HR Solutions </h4>
                      <p>You are successfully registered with Skylark Job Portal. Please Login with Your email and complete the Profile details. </p>   
                     <p>Regards,</p>
                     <p>Skylark Hr Solutions</p>`;
    
    if (!checkUser) {
      if (file) {
        const formData = new Users({
          serialId: latestCandidate ? latestCandidate.serialId + 1 : 1,
          token: token,  
          name: data.name,
          email: data.email,
          phonenumber: data.phonenumber,
          location: data.location,
          clientName: data.clientName,
          role: data.role,
          currentCompany: data.currentCompany,
          experience: data.overAllExp,
          currentctc: data.currentCtc,
          expectedctc: data.expectedCtc,
          noticeperiod: data.noticePeriod,
          remarks: data.remarks,
          cvpath: file.path, 
          cvname: file.filename
        });

        await formData.save();
        sendMail(data.email, "Registration Successfull with Skylark Job Portal", content);
        return res.status(200).json({ message: 'User successfully registered.' });
      }

      if (!file) {
        const formData = new Users({

          serialId: latestCandidate ? latestCandidate.serialId + 1 : 1,
          token: token,  
          name: data.name,
          email: data.email,
          phonenumber: data.phonenumber,
          location: data.location,
          clientName: data.clientName,
          role: data.role,
          currentCompany: data.currentCompany,
          experience: data.experience,
          currentctc: data.currentCtc,
          expectedctc: data.expectedCtc,
          noticeperiod: data.noticePeriod,
          remarks: data.remarks,
          cvpath: "",
          cvname: "",
        });
        await formData.save();
        return res.status(200).json({ message: 'User successfully registered.' });
      }
    } else { 
      if (file) {
        await Users.updateOne({ email: data.email }, { $set: {
          name: data.name,
          phonenumber: data.phonenumber,
          location: data.location,
          clientName: data.clientName,
          role: data.role,
          currentCompany: data.currentCompany,
          experience: data.experience,
          currentctc: data.currentCtc,
          expectedctc: data.expectedCtc,
          noticeperiod: data.noticePeriod,
          remarks: data.remarks,
          cvpath: file.path, 
          cvname: file.filename
        }});
        sendMail(data.email, "Registration Successfull with Skylark Job Portal", content);
        return res.status(200).json({ message: 'User already exists. File updated successfully' });
      }

      if (!file) {
        await Users.updateOne({ email: data.email }, { $set: {
          name: data.name,
          phonenumber: data.phonenumber,
          location: data.location,
          clientName: data.clientName,
          role: data.role,
          currentCompany: data.currentCompany,
          experience: data.experience,
          currentctc: data.currentCtc,
          expectedctc: data.expectedCtc,
          noticeperiod: data.noticePeriod,
          remarks: data.remarks
        }});
        return res.status(200).json({ message: 'User already exists. Data updated successfully' });
      }
    }

  } catch (error) {
    console.error('Error occurred in Upload Route:', error.message);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
});

function generateToken(payload) {
  const token = jwt.sign({ email: payload.email,name : payload.name }, process.env.signUp_SecretKey, {
    expiresIn: '1h', // You can adjust the expiration time
  });

  return token;
}

// Download Cv Route
router.get('/download/:candidateId/:jobId', async (req, res) => {
  try {
    const { candidateId, jobId } = req.params;
    const candidate = await Users.findById(candidateId);

    if (!candidate) {
      return res.status(404).json({ message: 'Candidate not found' });
    }
    const appliedJob = candidate.appliedJobs.find(job => job.jobid == jobId);

    if (!appliedJob) {
      return res.status(404).json({ message: 'Candidate has not applied for this job' });
    }
    const filePath = appliedJob.cvpath;

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
// download cv only without job id 
router.get('/download/:candidateId', async (req, res) => {
  try {
    const { candidateId} = req.params;
    
    const candidate = await Users.findById(candidateId);
    console.log("check:",candidate)

    if (!candidate) {
      return res.status(404).json({ message: 'Candidate not found' });
    }
   
    const filePath = candidate.cvpath;

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




// Show PDF
router.get('/pdfs/:id', async (req, res) => {
  console.log("show :",req.params)
  try {
    const { id } = req.params;
   
    const uploadedFile = await UploadedFile.findById(id);
    if (!uploadedFile) {
      return res.status(404).send('File not found');
    }
    res.sendFile(path.resolve(uploadedFile.cvpath));
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});


module.exports = router;
