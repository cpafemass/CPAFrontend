import type { QuestionId, Respostas } from './survey-types'

export const escalaAvaliacao = [
  { valor: 1, rotulo: 'Discordo totalmente' },
  { valor: 2, rotulo: 'Discordo' },
  { valor: 3, rotulo: 'Nem concordo nem discordo' },
  { valor: 4, rotulo: 'Concordo' },
  { valor: 5, rotulo: 'Concordo totalmente' },
]

export const textoIntrodutorioAvaliacao =
  'Avalie as afirmações abaixo de acordo com a sua experiência na disciplina. Utilize a escala de 1 a 5, em que 1 significa Discordo totalmente e 5 significa Concordo totalmente. As respostas são confidenciais e utilizadas exclusivamente para fins de avaliação institucional e melhoria acadêmica.'

export const perguntas: Array<{ id: QuestionId; texto: string }> = [
  {
    id: 'q1',
    texto: 'Promove o debate e instiga o pensamento crítico, colaborando para a autonomia dos estudantes.',
  },
  {
    id: 'q2',
    texto: 'Relaciona aspectos teóricos com suas implicações e aplicações práticas.',
  },
  {
    id: 'q3',
    texto: 'Há coerência entre o que é ensinado e o que solicita nas avaliações.',
  },
  {
    id: 'q4',
    texto: 'Utiliza diferentes estratégias avaliativas.',
  },
  {
    id: 'q5',
    texto: 'Relaciona a sua disciplina com conteúdos, competências e habilidades de outras disciplinas do curso.',
  },
  {
    id: 'q6',
    texto: 'Analisa os resultados das avaliações com os estudantes, desenvolvendo mecanismos para a superação das dificuldades.',
  },
  {
    id: 'q7',
    texto: 'Mostra-se aberto ao diálogo, motivando os discentes a prosseguir nos estudos.',
  },
  {
    id: 'q8',
    texto: 'Faz uso adequado do seu tempo regular de aula, facilitando a aprendizagem em sala de aula.',
  },
  {
    id: 'q9',
    texto: 'Apresentou a disciplina disponibilizando plano de curso, estratégias de ensino e critérios de avaliação.',
  },
  {
    id: 'q10',
    texto: 'Utiliza diferentes estratégias pedagógicas ou andragógicas que incentivam a aprendizagem e a pesquisa.',
  },
]

export const defaultRespostas: Respostas = {
  q1: 0,
  q2: 0,
  q3: 0,
  q4: 0,
  q5: 0,
  q6: 0,
  q7: 0,
  q8: 0,
  q9: 0,
  q10: 0,
  comentario: '',
}
