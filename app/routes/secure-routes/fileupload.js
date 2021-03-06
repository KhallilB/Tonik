// This file will handle files being uploaded
const multer = require('multer');
const multerS3 = require('multer-s3');
const aws = require('aws-sdk');
const upload = require('..//..//aws-login')
const Songs = require('../../models/song');
require('dotenv').config('../.env')
const mongoose = require('mongoose');

const singleUpload = upload.single('audio')

module.exports = (app) => {

    app.post('/audio-upload', (req, res) => {
        singleUpload(req, res, (err, some) => {
            if (err) {
                return res.json({
                    err: [{
                        title: 'Audio file upload error',
                        detail: err.message
                    }]
                });
            } else {
                const songs = new Songs({
                    artist_name: req.body.artist_name,
                    song_title: req.body.song_title,
                    song_link: req.file.location,
                    genre: req.body.genre

                });
                songs.save().then(() => {
                    console.log('file saved to database and s3')
                    return res.json({
                        'imageUrl': req.file.location,
                        "fileSaved": "file has been saved to db and s3"


                    }).catch(error => {
                        console.log(error);
                        res.status(500).json({
                            error: err
                        });
                    })
                })


            }
        });


    });

}