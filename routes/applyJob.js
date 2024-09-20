const express = require('express');
const multer = require('multer');
const router = express.Router();
const PostedJobs = require('../models/PostedJobs');
const Users = require('../models/Users');
const fs = require('fs');
const path = require('path');
const { applyMail } = require('../controllers/sendMail');

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
        const recruitermail = job.recruiterEmail
        const jobsmail = process.env.jobmail 

        const attached = [{
                         filename: cv, 
                         path: cvpath
                       }]
        const adminMessage = `
        <!DOCTYPE html>
        <html lang="en">
          <head>
            <meta charset="UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <title>Job Applied Notification</title>
            <style>
              body {
                font-family: Arial, sans-serif;
                margin: 0;
                padding: 0;
                background-color: #f4f4f4;

              }
        
              .container {
                max-width: 600px;
                margin: 20px auto;
                padding: 20px;
                background-color: #ffffff;
                border-radius: 8px;
                box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
              }
        
              h2 {
                color: #333333;
                margin-top: 0;
              }
        
              table {
                width: 100%;
                border-collapse: collapse;
                margin-bottom: 20px;
              }
        
              table,
              th,
              td {
                border: 1px solid #dddddd;
                text-align: left;
              }
        
              th,
              td {
                padding: 10px;
              }
        
              .header {
                background-color: #f9f9f9;
                padding: 20px 0;
                text-align: center;
                border-top-left-radius: 8px;
                border-top-right-radius: 8px;
              }
        
              .footer {
                background-color: #f9f9f9;
                padding: 20px;
                text-align: center;
                border-bottom-left-radius: 8px;
                border-bottom-right-radius: 8px;
              }
        
              .footer p {
                color: #666666;
                font-size: 12px;
                margin: 0;
              }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h2>Job Applied For : ${job.jobtitle.replace(/\b\w/g,c=>c.toUpperCase())} </h2>
              </div>
              <div class="content">
                <p>Hello Admin,</p>
                <p>A new user has  applied for the  job. Below are the details:</p>
                <table>
                  <tr>
                    <th>Name</th>
                    <td>${user.name.replace(/\b\w/g,c=>c.toUpperCase())}</td>
                  
                  </tr>
                  <tr>
                    <th>Email</th>
                   <td><a href="mailto:${user.email}">${user.email}</a></td> 
                  
                  </tr>
                  <tr>
                    <th>Phone Number</th>
                    <td>${user.phonenumber}</td>
                  </tr>
                  <tr>
                    <th>Designation</th>
                    <td>${user.role}</td>
                  </tr>
                  <tr>
                    <th>Location</th>
                    <td>${user.location}</td>
                  </tr>
                  <tr>
                    <th>Experience</th>
                    <td> ${user.experience} Years</td>
                  </tr>
                  
                </table>
                <p>Please take necessary action.</p>
              </div>
              <div class="footer">
                <p>Best Regards,<br /></p>
                <a target="_blank" href="https://www.skylarkjobs.com/#/findcandidate">
                  Skylarkjobs.com</a
                >
              </div>
            </div>
          </body>
        </html>
        `
        applyMail(recruitermail,`Candidate Applied for - ${job.jobtitle.replace(/\b\w/g,c=>c.toUpperCase())} `, adminMessage,attached,jobsmail);
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
