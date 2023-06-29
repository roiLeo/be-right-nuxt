import mailjet from 'node-mailjet'
import type { MailJetContactPayload } from '../../../types/Newsletter'

export default defineEventHandler(async event => {
  const contacts = await readBody<MailJetContactPayload[]>(event)

  if (
    !process.env.NEWSLETTER_RECIPIENT_LIST_ID
    || !process.env.MJ_APIKEY_PUBLIC
    || !process.env.MJ_APIKEY_PRIVATE
  ) {
    throw createError({ statusCode: 422, statusMessage: 'Mails indiponibles' })
  }
  const mailCLient = mailjet.apiConnect(process.env.MJ_APIKEY_PUBLIC!, process.env.MJ_APIKEY_PRIVATE!)

  const request = await mailCLient.post('contactslist', { version: 'v3' })
    .id(process.env.NEWSLETTER_RECIPIENT_LIST_ID)
    .action('managemanycontacts')
    .request({
      Action: 'addnoforce',
      Contacts: contacts,
    })

  return {
    status: request.response.status,
    statusText: request.response.statusText,
  }
})
