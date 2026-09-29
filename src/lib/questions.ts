import type { QuestionAnswers } from '../types';
import type { DimKey } from '../components/DimensionScore';

export interface Question {
  key: keyof QuestionAnswers;
  dim: DimKey;
  third: string;
  first: string;
}

export const QUESTIONS: Question[] = [
  {
    key: 'K1',
    dim: 'K',
    third: 'Performs the task according to the required process and standards without repeatedly asking how to do it.',
    first: 'I can perform this task according to the required process without repeatedly asking how to do it.',
  },
  {
    key: 'K2',
    dim: 'K',
    third: 'Can explain the reasoning behind their approach.',
    first: 'I can explain the reasoning behind my approach.',
  },
  {
    key: 'K3',
    dim: 'K',
    third: 'Produces work with few errors and identifies mistakes before submission.',
    first: 'I produce work with few errors and identify mistakes before submission.',
  },
  {
    key: 'T1',
    dim: 'T',
    third: 'Applies relevant knowledge and experience from other work to this task.',
    first: 'I apply relevant knowledge and experience from other work to this task.',
  },
  {
    key: 'T2',
    dim: 'T',
    third: 'Handles unexpected situations that are not explicitly covered by instructions.',
    first: 'I handle unexpected situations that are not explicitly covered by instructions.',
  },
  {
    key: 'T3',
    dim: 'T',
    third: 'Prioritizes work and manages time effectively to meet deadlines.',
    first: 'I prioritize my work and manage time effectively to meet deadlines.',
  },
  {
    key: 'M1',
    dim: 'M',
    third: 'Proactively accepts or suggests additional work related to the task.',
    first: 'I proactively accept or suggest additional work related to this task.',
  },
  {
    key: 'M2',
    dim: 'M',
    third: 'Maintains work quality even without direct supervision.',
    first: 'I maintain work quality even without direct supervision.',
  },
  {
    key: 'M3',
    dim: 'M',
    third: 'Starts work promptly rather than delaying or avoiding it.',
    first: 'I start work promptly rather than delaying or avoiding it.',
  },
  {
    key: 'C1',
    dim: 'C',
    third: 'Makes decisions within their authority without constantly asking for confirmation.',
    first: 'I make decisions within my authority without constantly asking for confirmation.',
  },
  {
    key: 'C2',
    dim: 'C',
    third: 'Confidently presents their results and opinions.',
    first: 'I confidently present my results and opinions.',
  },
  {
    key: 'C3',
    dim: 'C',
    third: 'Responds calmly to mistakes and focuses on correcting them rather than becoming overly anxious or defensive.',
    first: 'I respond calmly to mistakes and focus on correcting them rather than becoming overly anxious or defensive.',
  },
];

export const DIMENSION_SECTIONS: { dim: DimKey; title: string }[] = [
  { dim: 'K', title: 'KNOWLEDGE — K' },
  { dim: 'T', title: 'TRANSFERABLE SKILLS — T' },
  { dim: 'M', title: 'MOTIVATION — M' },
  { dim: 'C', title: 'CONFIDENCE — C' },
];
