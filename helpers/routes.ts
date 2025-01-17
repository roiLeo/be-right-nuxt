export enum RouteNames {
  // EVENTS
  CREATE_EVENT_STEP_1 = 'evenement-creer',
  CREATE_EVENT_STEP_2 = 'evenement-creer-step2',
  CREATE_EVENT_STEP_3 = 'evenement-creer-step3',
  CREATE_EVENT_STEP_PAYMENT = 'evenement-creer-paiement',

  LIST_EVENT = 'evenement',

  SHOW_EVENT_ID = 'evenement-show-id',

  // PAYMENTS
  PAYMENT_CONFIRM = 'paiement-confirmation',

  // EMPLOYEE
  EMPLOYEE_CREATE = 'destinataire-create',

  // AUTH
  FORGOT_PASSWORD = 'mot-de-passe-oublie',
  LOGIN = 'login',

  // ADMIN
  ADMIN_EVENTS = 'admin-events',
  ADMIN_EMPLOYEES = 'admin-destinataires',
  ADMIN_EMPLOYEE_SHOW = 'admin-destinataires-show-id',
}
