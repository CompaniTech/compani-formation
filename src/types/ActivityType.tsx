export interface ActivityType {
  _id: string,
  name: string,
  type: 'lesson' | 'quiz' | 'sharing_experience' | 'video',
  cards: Array<CardType>,
}

export interface CardType {
  _id: string,
  template: string,
}
