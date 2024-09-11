const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const { GridFsStorage } = require('multer-gridfs-storage'); 
const multer = require('multer');
const crypto = require('crypto');
const path = require('path');
const musicRoutes = require('./routes/musics');
require('dotenv').config(); 

const app = express();

app.use(cors());
app.use(express.json()); 
app.use('/api/musics', express.static(path.join(__dirname, 'uploads')));

const mongoURI = process.env.MONGO_URI;

mongoose.connect(mongoURI, {})
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB', error);
  });

app.use('/api/musics', musicRoutes);

let gfs;
const conn = mongoose.connection;

conn.once('open', () => {
    gfs = new mongoose.mongo.GridFSBucket(conn.db, {
      bucketName: 'uploads'
    });
    console.log('GridFS initialized');
  
    const storage = new GridFsStorage({
      db: conn.db,  
      file: (req, file) => {
        return new Promise((resolve, reject) => {
          crypto.randomBytes(16, (err, buf) => {
            if (err) {
              return reject(err);
            }
            const filename = buf.toString('hex') + path.extname(file.originalname);
            const fileInfo = {
              filename: filename,
              bucketName: 'uploads'
            };
            resolve(fileInfo);
          });
        });
      }
    });
  
    const upload = multer({ storage });
  
    app.post('/upload', upload.single('file'), (req, res) => {
      res.json({ file: req.file });
    });
  
  
    const PORT = process.env.PORT || 8000;
    app.listen(PORT, () => {
      console.log(`Server started on port ${PORT}`);
    });
  });