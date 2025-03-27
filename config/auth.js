
import { getUser,getUserByEmail } from '../controllers/userController.js';

export function ensureAuthenticated (req, res, next) {
      if (req.isAuthenticated()) {
        return next();
      }
      req.flash('error_msg', 'Please log in to view that resource');
      res.redirect('/user/login');
    }
    export function forwardAuthenticated (req, res, next) {
        if (!req.isAuthenticated()) {
          return next();
        }
        res.redirect('/dashboard');      
      }

      export async function adminRequired (req, res, next) {
        if (req.isAuthenticated()) {
          try{
            const user = await getUserByEmail(req.user[0].email);
            if(user.role == 'admin'){
              return next();
            }
            else{
              req.flash('error_msg', 'You are not authorized to view that resource');
              res.redirect('/dashboard');
            }
          }
          catch(e){
            console.log(e);
            req.flash('error_msg', 'An error occurred.Please login again');
            res.redirect('/user/login');
          }
        }
           
      }