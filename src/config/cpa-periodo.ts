export const CPA_RESPONSES_CLOSE_AT = new Date('2026-06-27T00:00:00-03:00')

export const CPA_ENCERRADA_MESSAGE =
  'O período de participação na Avaliação Institucional da CPA foi encerrado em 26/06/2026 às 23h59.'

export function isCpaClosed(now = new Date()) {
  return now.getTime() >= CPA_RESPONSES_CLOSE_AT.getTime()
}