import { User, Project } from '../models';
import { errorHandler, dataHandler, okHandler } from '../utils/handlers';

function listProfessors(req, res) {
  User.listProfessors()
    .then(dataHandler(res))
    .catch(errorHandler(res));
}

function approveProfessor(req, res) {
  User.approveProfessor(req.params.id)
    .then(okHandler(res))
    .catch(errorHandler(res));
}

function disapproveProfessor(req, res) {
  User.disapproveProfessor(req.params.id)
    .then(okHandler(res))
    .catch(errorHandler(res));
}

function listMatches(req, res) {
  Project.listMatches()
    .then(dataHandler(res))
    .catch(errorHandler(res));
}

function approveMatch(req, res) {
  Project.approveMatch(req.params.id)
    .then(okHandler(res))
    .catch(errorHandler(res));
}

function disapproveMatch(req, res) {
  Project.disapproveMatch(req.params.id)
    .then(okHandler(res))
    .catch(errorHandler(res));
}

export default {
  listProfessors,
  approveProfessor,
  disapproveProfessor,
  listMatches,
  approveMatch,
  disapproveMatch
};