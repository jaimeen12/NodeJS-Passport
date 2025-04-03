import express from 'express';
const router = express.Router();
import multer from 'multer';
import path from 'path';
import fs from 'fs';

import { getNotes, getNote,getAllNotes,getAllFiles, createNoteController, deleteNoteController, updateNoteController, sayHello } from '../controllers/notesController.js';

import { adminRequired, ensureAuthenticated, forwardAuthenticated } from '../config/auth.js';




// Route for homepage
router.get('/', (req, res) => {
    res.render('welcome');
});

router.get('/downloadfile/:title',ensureAuthenticated, (req, res) => {
  const title = req.params.title;
  console.log(title);
  const user = req.user[0].email;
  const filePath =`uploads/${user}/${title}`;
  console.log(filePath);


  if (!fs.existsSync(filePath)) {
    console.log(filePath)
    console.log('File not found');
    const notFoundError = new CustomError(404, 'PDF file not found');
    return next(notFoundError);
  }

  res.download(filePath, `${title}`, (err) => {
    if (err) {
      console.log(err);
      const downloadError = new CustomError(500, 'Error: Unable to download the PDF file');
      return next(downloadError);
    }
  });
});

router.get('/upload', ensureAuthenticated, (req, res) => {
    const title = req.params.title;
    res.render('upload');
});

router.post('/upload', ensureAuthenticated, (req, res) => {
    const user = req.user[0].email;
    const destination= `uploads/${user}/`;
    console.log(req.file)
    // Set up storage engine

    const storage = multer.diskStorage({
      destination: destination,
      filename: function(req, file, cb) {
        cb(null, file.originalname + '-' + Date.now() + path.extname(file.originalname));
      }
    });
    
    
    const upload = multer({
      storage: storage,
      limits: { fileSize: 1000000 }, // Limit file size to 1MB
      fileFilter: function(req, file, cb) {
        checkFileType(file, cb);
      }
    }).single('myImage');
    
    // Check file type
    function checkFileType(file, cb) {
      const filetypes = /pdf/;
      const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
      const mimetype = filetypes.test(file.mimetype);
    
      if (mimetype && extname) {
        return cb(null, true);
      } else {
        cb('Error: PDFs Only!');
      }
    }
   
    upload(req, res, (err) => {
      if (err) {
        console.log(err);
        let errs=[];
        errs.push({ msg: err });
        res.render('upload',{errors: errs });
      } else {
        if (req.file == undefined) {
            res.redirect('/dashboard');
            console.log('No file selected!');
        } else {
            res.redirect('/dashboard');
            console.log(req.file.filename);
        }
      }
    });
    console.log("upload completed")
  });

router.get('/admin', ensureAuthenticated,adminRequired, async (req, res) =>{
    const email = req.user[0].email;
    const notes = await getAllNotes();
    const files = await getAllFiles();

// Use filter function with path and fs package to filter only files

    console.log(files);
    res.render('admin', {
      notes,fileList: files
    })
  });

router.get('/dashboard', ensureAuthenticated, async (req, res) =>{
    const email = req.user[0].email;
    const notes = await getNotes(email);
    var completed=0;
    var pending=0;
    var total = notes.length;
    const directoryPath = `uploads/${email}/`;
    const fileList = fs.readdirSync(directoryPath);
    console.log(fileList);
    notes.forEach((note) =>{
        if(note.status == 'completed'){
            completed++;
        }
        else{
            pending++;
        }
    })
    
    res.render('dashboard', {
      name: req.user[0].first_name,
      notes, completed, pending,total,fileList
    })
  });

router.get('/createNoteForm', async (req, res) => {
    res.render('createNoteForm');
});

router.post('/createNote', async (req, res) => {
    const user = req.user[0].email;
    const title=req.body.title;
    const status=req.body.status;
    console.log(title, status,user);
    try{
        const note = await createNoteController(title, status, user);
    }
    catch(e){
        console.log(e)
        res.redirect('/createNoteForm');
    }

    res.redirect('/dashboard');
});

router.get('/updateNoteForm/:id', async (req, res) => {
    const note = await getNote(req.params.id);
    res.render('updateNoteForm', {id:note.id, title:note.title, contents:note.contents});
});

router.post('/updateNote/:id', async (req, res) => {
    const userEmail = req.user[0].email;
    const title=req.body.title;
    const status=req.body.status;
    const id=req.params.id;
    console.log(req.body.status);
    try{
        const note = await updateNoteController(title, status, id, userEmail);
    }
    catch(e){
        console.log(e)
        res.redirect(`/updateNoteForm/${id}`);
    }

    res.redirect('/dashboard');
});


router.get('/deleteNote/:id', async (req, res) => {
    const id=req.params.id;
    const userEmail=req.user[0].email;
    console.log(id)
    try{
        const note = await deleteNoteController(id, userEmail);
        console.log(note)
    }
    catch(e){
        console.log(e)
        res.redirect('/deleteNoteForm');
    }
    
    res.redirect('/dashboard')
});


export default router;