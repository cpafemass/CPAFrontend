import type {
  CatalogForm,
  CatalogOption,
  FormScope,
  ParticipantType,
  Pergunta,
} from './survey-types'

type UnknownRecord = Record<string, unknown>

const audiences: ParticipantType[] = ['aluno', 'professor', 'funcionario']
const scopes: FormScope[] = ['DISCIPLINA', 'GERAL']

function isRecord(value: unknown): value is UnknownRecord {
  return typeof value === 'object' && value !== null
}

function stringField(value: unknown, field: string): string {
  if (typeof value !== 'string' || !value.trim()) {
    throw new Error(`O catálogo possui ${field} inválido.`)
  }

  return value.trim()
}

function numericField(value: unknown, field: string): number {
  if (typeof value !== 'number' || !Number.isFinite(value)) {
    throw new Error(`O catálogo possui ${field} inválido.`)
  }

  return value
}

function optionalOrder(value: unknown): number | undefined {
  return typeof value === 'number' && Number.isFinite(value)
    ? value
    : undefined
}

function compareByOrder<T extends { order?: number; code?: string; id?: string }>(
  left: T,
  right: T,
) {
  const leftOrder = left.order ?? Number.MAX_SAFE_INTEGER
  const rightOrder = right.order ?? Number.MAX_SAFE_INTEGER
  if (leftOrder !== rightOrder) return leftOrder - rightOrder

  return (left.code ?? left.id ?? '').localeCompare(right.code ?? right.id ?? '')
}

function normalizeOption(value: unknown): CatalogOption {
  if (!isRecord(value)) throw new Error('O catálogo possui uma opção inválida.')

  return {
    code: stringField(value.code, 'código de opção'),
    label: stringField(value.label, 'rótulo de opção'),
    order: optionalOrder(value.order ?? value.ordem),
    active: value.active !== false,
    naoSeiResponder: value.naoSeiResponder === true,
  }
}

function normalizeQuestion(value: unknown): Pergunta {
  if (!isRecord(value)) throw new Error('O catálogo possui uma pergunta inválida.')
  if (!Array.isArray(value.options)) {
    throw new Error('O catálogo possui uma pergunta sem opções.')
  }

  const options = value.options
    .map(normalizeOption)
    .filter((option) => option.active !== false)

  if (options.some((option) => option.order !== undefined)) {
    options.sort(compareByOrder)
  }

  if (value.active !== false && options.length === 0) {
    throw new Error('O catálogo possui uma pergunta ativa sem opções disponíveis.')
  }

  return {
    id: stringField(value.id, 'código de pergunta'),
    texto: stringField(value.texto, 'texto de pergunta'),
    ordem: optionalOrder(value.ordem ?? value.order),
    required: value.required !== false,
    active: value.active !== false,
    options,
  }
}

function normalizeForm(value: unknown): CatalogForm {
  if (!isRecord(value)) throw new Error('O catálogo possui um formulário inválido.')
  if (!Array.isArray(value.questions)) {
    throw new Error('O catálogo possui um formulário sem perguntas.')
  }

  const audience = stringField(value.audience, 'público') as ParticipantType
  const scope = stringField(value.scope, 'escopo') as FormScope
  if (!audiences.includes(audience) || !scopes.includes(scope)) {
    throw new Error('O catálogo possui um público ou escopo inválido.')
  }

  const questions = value.questions
    .map(normalizeQuestion)
    .filter((question) => question.active !== false)
    .sort((left, right) =>
      compareByOrder({ order: left.ordem, id: left.id }, { order: right.ordem, id: right.id }),
    )

  if (value.active !== false && questions.length === 0) {
    throw new Error('O catálogo possui um formulário ativo sem perguntas disponíveis.')
  }

  const commentAllowed = value.commentAllowed === true
  return {
    campaign: stringField(value.campaign, 'campanha'),
    code: stringField(value.code, 'código de formulário'),
    name: stringField(value.name, 'nome de formulário'),
    audience,
    version: numericField(value.version, 'versão de formulário'),
    order: numericField(value.order, 'ordem de formulário'),
    scope,
    commentAllowed,
    commentRequired: commentAllowed && value.commentRequired === true,
    commentNotice:
      typeof value.commentNotice === 'string' && value.commentNotice.trim()
        ? value.commentNotice.trim()
        : undefined,
    active: value.active !== false,
    questions,
  }
}

export function normalizeCatalog(value: unknown): CatalogForm[] {
  if (!Array.isArray(value)) {
    throw new Error('O backend retornou um catálogo de formulários inválido.')
  }

  return value
    .map(normalizeForm)
    .filter((form) => form.active !== false)
    .sort(compareByOrder)
}

export function availableQuestions(form: CatalogForm): Pergunta[] {
  return form.questions.filter((question) => question.active !== false)
}

export function availableOptions(question: Pergunta): CatalogOption[] {
  return question.options.filter((option) => option.active !== false)
}

export function isQuestionRequired(question: Pergunta): boolean {
  return question.required !== false
}

export function isCommentRequired(form: CatalogForm): boolean {
  return form.commentAllowed && form.commentRequired === true
}
