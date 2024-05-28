// Create web server

// Import express module
const express = require('express');
// Create express application
const app = express();

// Import body-parser module
const bodyParser = require('body-parser');
// Parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// Parse application/json
app.use(bodyParser.json());

// Import path module
const path = require('path');

// Import fs module
const fs = require('fs');

// Import comment module
const comment = require('./comments');

// Import multer module
const multer = require('multer');
// Set storage
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, './public/uploads/');
    },
    filename: function(req, file, cb) {
        cb(null, file.originalname);
    }
});
// Set upload
const upload = multer({
    storage: storage
});

// Set path
app.use(express.static(path.join(__dirname, 'public')));

// Set view engine
app.set('view engine', 'ejs');
// Set path
app.set('views', path.join(__dirname, 'views'));

// Set route
app.get('/', function(req, res) {
    res.render('index');
});

// Set route
app.post('/comment', function(req, res) {
    // Get comment
    let commentData = req.body.comment;
    // Add comment
    comment.add(commentData);
    // Send comment
    res.send(commentData);
});

// Set route
app.get('/comments', function(req, res) {
    // Get comments
    let comments = comment.getAll();
    // Send comments
    res.send(comments);
});

// Set route
app.post('/upload', upload.single('file'), function(req, res) {
    // Get file
    let file = req.file;
    // Send file
    res.send(file);
});

// Set route
app.get('/download', function(req, res) {
    // Get file
    let file = './public/uploads/' + req.query.file;
    // Send file
    res.download(file);
});

// Set route
app.get('/files', function(req, res) {
    // Get files
    fs.readdir('./public/uploads/', function(err, files) {
        // Send files
        res.send(files);
    });
});

// Set port
const port = 3000;
// Listen port
app.listen(port, function() {
    console.log('Server up')
});