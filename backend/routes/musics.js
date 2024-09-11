const express = require('express');
const multer = require('multer');
const mongoose = require("mongoose");
const Music = require("../models/Music");
const router = express.Router();

const upload = multer({ dest: "uploads/" });

router.get("/" , async(req , res) => {
    const musics = await Music.find();
    res.json(musics);
})

const fs = require('fs');
const path = require('path');

router.post('/upload', upload.single('file'), async (req, res) => {
    try {
        const newFilename = req.file.filename.endsWith('.mp3')
            ? req.file.filename
            : `${req.file.filename}.mp3`;

        const oldPath = path.join(__dirname, '../uploads/', req.file.filename);
        const newPath = path.join(__dirname, '../uploads/', newFilename);

        fs.renameSync(oldPath, newPath);

        const newMusic = new Music({
            title: req.body.title,
            artist: req.body.artist,
            filename: newFilename,
        });

        await newMusic.save();
        res.json(newMusic);
    } catch (error) {
        res.status(500).json({ message: 'Error uploading Music' });
    }
});

router.put('/:id', async (req, res) => {
    const updatedMusic = await Music.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedMusic);
});

router.delete('/:id', async (req, res) => {
    try {
        const music = await Music.findByIdAndDelete(req.params.id);
        if (!music) {
            return res.status(404).json({ message: 'Music not found' });
        }

        const filePath = path.join(__dirname, '../uploads/', music.filename);
        fs.unlink(filePath, (err) => {
            if (err) {
                console.error('Error deleting file:', err);
            }
        });

        res.json({ message: 'Music deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
