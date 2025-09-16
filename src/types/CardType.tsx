export type CardType =
SingleChoiceQuestionType |
TransitionType |
TitleTextMediaType |
TextMediaType |
SurveyType |
TitleTextType |
MultipleChoiceQuestionType |
FlashCardType |
OpenQuestionType |
OrderTheSequenceType;

export type TransitionType = {
  _id: string,
  template: string,
  title: string,
}

export type TitleTextMediaType = {
  _id: string,
  template: string,
  title: string,
  media: {
    link: string,
    publicId: string,
    type: string,
  },
  text: string,
}

export type SingleChoiceQuestionType = {
  _id: string,
  template: string,
  question: string,
  qcAnswers: StoreAnswerType[],
  explanation: string,
}

export type TextMediaType = {
  _id: string,
  template: string,
  media: {
    link: string,
    publicId: string,
    type: string,
  },
  text: string,
}

export type SurveyType = {
  _id: string,
  template: string,
  question: string,
  isMandatory: boolean,
  labels: { [key: string]: string },
}

export type TitleTextType = {
  _id: string,
  template: string,
  title: string,
  text: string,
}

export type StoreAnswerType = {
  _id: string
  isCorrect: boolean,
  text: string,
  isSelected: boolean
  position?: number
}

export type AnswerPositionType = {
  _id: string
  goodPosition: number,
  tempPosition: number,
  label: string
}

export type MultipleChoiceQuestionType = {
  _id: string,
  template: string,
  question: string,
  qcAnswers: StoreAnswerType[],
  explanation: string,
}

export type FlashCardType = {
  _id: string,
  template: string,
  text: string,
  backText: string,
}
export type OpenQuestionType = {
  _id: string,
  template: string,
  question: string,
  isMandatory: boolean,
  answer?: string,
}

export type OrderedAnswerType = {
  text: string,
  _id: string,
}

export type OrderTheSequenceType = {
  _id: string,
  template: string,
  question: string,
  orderedAnswers: OrderedAnswerType[],
  explanation: string,
  isChronological: boolean,
}

export type GapAnswerType = {
  text: string,
  _id: string,
  isCorrect: boolean,
}

export type FillTheGapType = {
  _id: string,
  template: string,
  gappedText: string,
  gapAnswers: GapAnswerType[],
  explanation: string,
  canSwitchAnswers: boolean,
}

export type AnswerFromAPIType = {
  _id: string,
  text: string,
}

export type QuestionAnswerType = {
  _id: string,
  isQuestionAnswerMultipleChoiced: boolean,
  question: string,
  qcAnswers: AnswerFromAPIType[],
  isMandatory: boolean,
}

export type footerColorsType = {
  buttons: string,
  text: string,
  background: string,
}
