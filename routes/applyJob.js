const express = require('express');
const multer = require('multer');
const router = express.Router();
const PostedJobs = require('../models/PostedJobs');
const Users = require('../models/Users');
const fs = require('fs');
const path = require('path');

// const upload = multer({ dest: 'uploads/' });
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

  router.post('/apply/:id', upload.single('file'), async (req, res) => {
    try {
        const { id } = req.params;
        const { candidateId } = req.body;
        const { filename: cv, path: cvpath } = req.file;

        const job = await PostedJobs.findById(id);
        if (!job) {
            return res.status(404).json({ error: 'Job not found' });
        }

        const user = await Users.findById(candidateId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Check if candidate has already applied for this job
        const hasApplied = job.applicants.some(applicant => applicant.candidateId == candidateId);
       
        if (hasApplied) {
            return res.status(202).send('Candidate has already applied for this job' );
        }
        else if(!hasApplied){

        const appliedJob = {
            jobid: id,
            cvname: cv,
            cvpath: cvpath
        };

        const applicant = {
            jobtitle : job.jobtitle,
            candidateId: candidateId,
            candidateName: user.name,
            candidateEmail: user.email,
            candidatePhone: user.phonenumber,
            location : user.location, 
            cvname: cv,
            cvpath: cvpath,
            status: "New"
        };

        user.appliedJobs.push(appliedJob);
        await user.save();

        job.applicants.push(applicant);
        await job.save();

        res.status(201).json({ message: 'Application submitted successfully' });
      }
    } catch (error) {
        console.error('Error applying for job:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Updating Application Status
router.put('/update/:id', async (req, res) => {
  try {
    const jobId = req.params.id;
    const { candidateId, status } = req.body;
   

    // Update the job status in the database
    const updatedJob = await PostedJobs.findOneAndUpdate(
      { _id: jobId, "applicants._id": candidateId }, 
      { $set: { "applicants.$.status": status } }, 
      { new: true }
    );

    if (!updatedJob) {
      return res.status(404).json({ error: 'Job or applicant not found' });
    }

    // Return updated job data
    res.status(200).json(updatedJob);
  } catch (error) {
    console.error('An error occurred while updating:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});



  

module.exports = router;
