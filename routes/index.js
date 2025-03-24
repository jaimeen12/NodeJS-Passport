import express from 'express';
const router = express.Router();

import { getNotes, getNote, createNoteController, deleteNoteController, updateNoteController, sayHello } from '../controllers/notesController.js';
import { getPortswigger } from '../controllers/scraperController.js';

import { ensureAuthenticated, forwardAuthenticated } from '../config/auth.js';

// Route for homepage
router.get('/', (req, res) => {
    res.render('welcome');
});

router.get('/dashboard', ensureAuthenticated, async (req, res) =>{
    const email = req.user[0].email;
    const notes = await getNotes(email);
    var completed=0;
    var pending=0;
    var total = notes.length;
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
      notes, completed, pending,total
    })
  });

router.post('/portswigger', ensureAuthenticated, async (req, res) =>{
//const email = "jaimeenlalloo13@gmail.com";
//const password = "_6TW7F_,k[28rTk52x4A_9Hpx|-@+89q"
const email = req.body.email;
const password = req.body.password;
const notes = await getPortswigger(email,password);
console.log(notes);

res.render('portswigger', {
    notes
})
});

router.get('/portswiggerForm', ensureAuthenticated, async (req, res) =>{
    
    res.render('portswiggerForm')
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