const express = require('express')
const router = express.Router();
const PostedJobs = require('../models/PostedJobs')

router.get('/getdata', async (req, res) => {
    try {
        const jobs = await PostedJobs.find();
        res.json(jobs);
    } catch (error) {
        console.error('Error fetching job data:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
router.get('/specificjob/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const job = await PostedJobs.findById(id); 
        if (!job) { 
            return res.status(404).json({ error: 'Job not found' });
        }
        res.json(job); // Send the job data as response
    } catch (error) {
        console.error('Error fetching job data:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.post('/upload',async (req,res)=>{
    const data = req.body
    const latestCandidate = await PostedJobs.findOne({}, {}, { sort: { serialId: -1 } });
    const formData = new PostedJobs({
        serialId: latestCandidate ? latestCandidate.serialId + 1 : 1, // Incrementing candidateId
        jobtitle: data.jobtitle, 
        companyName:data.companyName,
        jobtype:data.jobtype,
        category:data.category,
        gender:data.gender,
        companyprofile:data.companyprofile,
        jobdescription: data.jobdescription,
        experience:data.experience,
        salary:data.salary,
        location:data.location,
        qualification:data.qualification,
        workmode:data.workmode,
        noticePeriod:data.noticePeriod,
        recruiterName:data.recruiterName,
        phoneNumber:data.phoneNumber,
        recruiterEmail:data.recruiterEmail,
        primarySkills:data.primarySkills

    })
        await formData.save();
        return res.status(200).json({ message: 'File uploaded successfully' });
   

})





module.exports = router;