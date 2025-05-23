const express = require('express');
const Contact = require('../model/Contact-model');
const FetchUser = require('../middleware/FetchUser');
const router = express.Router();


router.post('/contactsubmit',FetchUser, async(req,res)=>{
  try {
    const {fullname,email,phone,subject,message} = req.body
    const contact = new Contact({
      user:req.user.id,
      fullname,
      email,
      phone,
      subject,
      message
    });
    await contact.save()
    res.status(201).json({message: 'Contact submitted successfully'})
  } catch (error) {
    console.error('Contact submission error:', error);
    res.status(400).json({
      message: 'Error submitting contact', 
      error: error.message
    });
  }
})

module.exports = router;