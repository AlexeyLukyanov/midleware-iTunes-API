const express = require('express');
const router = express.Router();
const musicController = require('../controllers/controller');

// Get homepage
router.get('/', function (req, res, next) {
    res.render('index')
})

// Get singer alboms and songs
router.get('/singer', musicController.artist_music_list);

module.exports = router;
