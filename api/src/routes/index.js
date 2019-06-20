import express from 'express';
import validator from '../utils/validator';
import schemas from '../schemas';
import multer from 'multer';
import auth from './auth';
import user from './user';
import isAuthenticated from '../utils/isAuthenticated';
import k from '../constants';

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const allAccess = isAuthenticated([k.PRFOESSOR, k.STUDENT, k.ADMIN]);
const professorAccess = isAuthenticated([k.PRFOESSOR, k.ADMIN]);

router.post('/register', validator(schemas.auth.register), auth.register);
router.get(
  '/register/resend/:email',
  validator(schemas.auth.registerResend),
  auth.registerResend
);
router.post(
  '/setpassword',
  validator(schemas.auth.setPassword),
  auth.setPassword
);
router.post(
  '/forgotpassword',
  validator(schemas.auth.forgotPassword),
  auth.forgotPassword
);
router.get('/logout', auth.logout);

router.get('/user', allAccess, user.userData);
router.get('/user/oauth', allAccess, user.oauthData);
router.post(
  '/user/update',
  validator(schemas.user.updateUser),
  allAccess,
  user.updateUser
);
router.post(
  '/professor/update',
  validator(schemas.user.updateProfessor),
  professorAccess,
  user.updateProfessor
);
router.post('/cv/update', upload.single('cv'), allAccess, user.updateCv);

export default passport => {
  router.get(
    '/auth/facebook',
    passport.authenticate('facebook', {
      scope: ['email']
    })
  );
  router.get(
    '/auth/facebook/callback',
    passport.authenticate('facebook', {
      successRedirect: process.env.OAUTH_SUCCESS_REDIRECT || '/',
      failureRedirect: process.env.OAUTH_FAILURE_REDIRECT || '/signin'
    })
  );
  router.get(
    '/auth/google',
    passport.authenticate('google', {
      scope: ['profile', 'email']
    })
  );
  router.get(
    '/auth/google/callback',
    passport.authenticate('google', {
      successRedirect: process.env.OAUTH_SUCCESS_REDIRECT || '/',
      failureRedirect: process.env.OAUTH_FAILURE_REDIRECT || '/signin'
    })
  );
  router.post(
    '/login',
    validator(schemas.auth.login),
    passport.authenticate('local', { failWithError: true }),
    auth.loginSuccess,
    auth.loginFailure
  );
  return router;
};
