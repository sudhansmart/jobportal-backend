const express = require('express');
const multer = require('multer');
const router = express.Router();
const UploadedFile = require('../models/UploadedFiles');
const Users = require('../models/Users');
const fs = require('fs');
const path = require('path');
const contentDisposition = require('content-disposition');

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
    const latestCandidate = await UploadedFile.findOne({}, {}, { sort: { serialId: -1 } });
     console.log("files :",data)
    if(file){ 
        const formData = new UploadedFile({
          serialId: latestCandidate ? latestCandidate.serialId + 1 : 1, // Incrementing candidateId
          name: data.name,
          email: data.email,
          phoneNumber: data.phoneNumber,
          location: data.location,
          preferredlocation:data.preferredlocation,
          qualification: data.qualification,
          currentCompany: data.currentCompany,
          overAllExp: data.overAllExp,
          relevantExp: data.relevantExp,
          currentCtc: data.currentCtc,
          expectedCtc: data.expectedCtc,
          noticePeriod: data.noticePeriod,
          dob:data.dob,
          gender: data.gender,
          skills: data.skills || ' ',
          cvpath: file.path, 
          fileName:file.name
        });
        await formData.save();
    
        return res.status(200).json({ message: 'File uploaded successfully' });
    }


   if(!file){ 
    const formData = new UploadedFile({
      serialId: latestCandidate ? latestCandidate.serialId + 1 : 1, // Incrementing candidateId
          
          name: data.name,
          email: data.email,
          phoneNumber: data.phoneNumber,
          location: data.location,
          preferredlocation:data.preferredlocation,
          qualification: data.qualification,
          currentCompany: data.currentCompany,
          overAllExp: data.overAllExp,
          relevantExp: data.relevantExp,
          currentCtc: data.currentCtc,
          expectedCtc: data.expectedCtc,
          noticePeriod: data.noticePeriod,
          dob:data.dob,
          gender: data.gender,
          skills: data.skills || ' ',
      cvpath: " ",
      fileName:" ",
    });
    await formData.save();
    return res.status(200).json({ message: 'File uploaded successfully' });
}
  } catch (error) {
    console.error('Error occurred in Upload Route:', error.message);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
});
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
