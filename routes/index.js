const express = require('express')
const router = express.Router()
const { ensureAuth, ensureGuest } = require('../middleware/auth')
const Story = require('../models/Story')



//login/landing page
//@route GET /
router.get('/', ensureGuest, (req,res)=>{
    res.render('login',{
        layout:'login',
    })
})

//login/landing page
//@route GET /dashboard
router.get('/dashboard', ensureAuth, async(req,res)=>{
    try {
        const stories = await Story.find({user: req.user.id}).lean()
        
    res.render('DashBoard',{
        name: req.user.firstName,
        stories
    })
    
    } catch (err) {
        console.error(err);
        res.render('error/500')
    }
    
})

module.exports = router