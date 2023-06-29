import type { MailJetContactResponse } from '~/types/Newsletter'

export default function newsletterHook() {
  async function addToContactList({
    email,
    name,
  }: {
    email: string
    name?: string
  }) {
    const { data: resDataSuccess } = await useFetch<MailJetContactResponse>('/api/mailjet/addToNewsletter', {
      method: 'post',
      body: [{
        email,
        IsExcludedFromCampaigns: false,
        Name: name || '',
      }],
    })

    return resDataSuccess.value
  }

  return {
    addToContactList,
  }
}
