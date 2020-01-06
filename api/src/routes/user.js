import path from 'path';
import User from '../models/user';
import { Professor } from '../models';
import { dataHandler, errorHandler, okHandler } from '../utils/handlers';
import { sendVerificationMail, sendContactUsMail } from '../mail';
import uuid from 'uuid';
import * as File from '../utils/file';
import { clean } from '../config/passport';

function userData(req, res) {
  if (!req.user)
    return dataHandler(res)({ loggedIn: false, user: null });

  User.findProfessorById(req.user.id)
  .then(user => { return { loggedIn: true, user } })
  .then(dataHandler(res))
  .catch(errorHandler(res));
}

function updateUser(req, res) {
  const { email, ...userData } = req.body;
  const emailShouldUpdate = email && !req.user.verified;
  const updateData = {
    ...userData,
    id: req.user.id
  };
  if (emailShouldUpdate) {
    updateData.email = email;
    updateData.token = uuid();
  }
  User.update(updateData)
    .then(emailShouldUpdate ? sendVerificationMail : Promise.resolve())
    .then(
      user =>
        new Promise((res, rej) =>
          req.login(clean(user), err => {
            if (err) rej(err);
            else res(clean(user));
          })
        )
    )
    .then(dataHandler(res))
    .catch(errorHandler(res));
}

function updateProfessor(req, res) {
  Professor.updateOrCreate({ ...req.body, userId: req.user.id })
    .then(dataHandler(res))
    .catch(errorHandler(res));
}

function updateCv(req, res) {
  const { file, user } = req
  const { id, firstName, lastName } = user
  const location = `users/${id}/cv/${file.originalname || 'file'}`

  return File.checkSize(file, 8)
  .then(() =>
    File.upload(
      location,
      file.mimetype,
      file.buffer,
    )
  )
  .then(() =>
    User.update({
      id: user.id,
      cvKey: location,
    })
  )
  .then(dataHandler(res))
  .catch(errorHandler(res));
}

function oauthData(req, res) {
  User.getOAuthData(req.user.id)
    .then(dataHandler(res))
    .catch(errorHandler(res));
}

function details(req, res) {
  User.findProfessorById(req.params.id)
    .then(data => dataHandler(res)(clean(data)))
    .catch(errorHandler(res));
}

function contactUs(req, res) {
  sendContactUsMail(req.body).then(okHandler(res));
}

function getCv(req, res) {
  User.findById(req.params.id)
    .then(user => File.getFileLocation(user.cvKey))
    .then(filepath => {
      res.download(filepath)
    })
    .catch(errorHandler(res));
}

export default {
  userData,
  updateUser,
  updateProfessor,
  updateCv,
  oauthData,
  details,
  contactUs,
  getCv
};
