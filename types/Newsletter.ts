export interface MailJetContactPayload {
  Email: string
  IsExcludedFromCampaigns: boolean
  Name: string
  Properties: Record<string, unknown>
}

export interface MailJetContactResponse {
  status: number
  statusText: string
}
