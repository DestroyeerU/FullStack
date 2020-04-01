import { Router } from 'express';

import SessionController from './app/controllers/SessionController';
import RecipientsController from './app/controllers/RecipientsController';

import authMiddleware from './app/middlewares/auth';

import sessionValidationForm from './app/middlewares/validation/session';
import recipientValidationForm from './app/middlewares/validation/recipient';

import recipientExistsMiddleware from './app/middlewares/recipient_exists';

const routes = new Router();

routes.get('/', (req, res) => {
  return res.json({ ok: true });
});

routes.post('/sessions', sessionValidationForm, SessionController.store);

routes.use(authMiddleware);

routes.post(
  '/recipients',
  recipientValidationForm,
  recipientExistsMiddleware,
  RecipientsController.store
);

export default routes;
