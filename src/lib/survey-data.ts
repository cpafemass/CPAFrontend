import type { Pergunta, Respostas } from './survey-types'

export const escalaAvaliacao = [
  { valor: 1, rotulo: 'Discordo totalmente' },
  { valor: 2, rotulo: 'Discordo' },
  { valor: 3, rotulo: 'Nem concordo nem discordo' },
  { valor: 4, rotulo: 'Concordo' },
  { valor: 5, rotulo: 'Concordo totalmente' },
]

export const textoIntrodutorioAvaliacao =
  'Avalie as afirmações abaixo de acordo com a sua experiência na disciplina. Utilize a escala de 1 a 5, em que 1 significa Discordo totalmente e 5 significa Concordo totalmente. As respostas são confidenciais e utilizadas exclusivamente para fins de avaliação institucional e melhoria acadêmica.'

export function buildDefaultRespostas(perguntas: Pergunta[]): Respostas {
  return {
    opcoes: Object.fromEntries(perguntas.map((pergunta) => [pergunta.id, ''])),
    comentario: '',
  }
}
