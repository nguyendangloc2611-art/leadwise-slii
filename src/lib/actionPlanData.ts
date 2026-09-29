import type { StyleId } from '../types';

export interface StylePlaybook {
  id: StyleId;
  objective: string;
  actions: string[];
  checkin: string;
  conversationStarter: string;
  avoid: string[];
  moveWhen: string;
  extraNote?: { title: string; items: string[] };
}

export const STYLE_PLAYBOOK: Record<StyleId, StylePlaybook> = {
  S1: {
    id: 'S1',
    objective: 'Build competence quickly while motivation is still high.',
    actions: [
      'Clearly define the expected result and what "good" looks like.',
      'Break the task into smaller steps.',
      'Demonstrate or explain each step.',
      'Set deadlines for intermediate milestones.',
      'Give immediate feedback after each step.',
      'Recognize enthusiasm without giving autonomy too early.',
    ],
    checkin: 'Daily or after each important step.',
    conversationStarter:
      "Here's what a strong result looks like. Let's go through the steps together, and after step one, send it to me for a quick review.",
    avoid: ['Assuming enthusiasm means competence', 'Giving too much autonomy too early', 'Overloading the employee with information'],
    moveWhen: 'Competence begins improving but frustration or declining motivation appears.',
  },
  S2: {
    id: 'S2',
    objective: 'Continue building competence while preventing discouragement.',
    actions: [
      'Ask where the employee is struggling.',
      'Listen before giving advice.',
      'Continue providing clear direction.',
      'Explain WHY the approach matters.',
      'Recognize small improvements.',
      'Ask for employee input before making the final decision.',
    ],
    checkin: '2–3 times per week, including 1:1 conversations.',
    conversationStarter:
      "I noticed this task has been challenging recently. What part feels most difficult right now? Let's solve that first.",
    avoid: ['Criticizing outcomes without understanding the cause', 'Encouragement without practical guidance', 'Removing support too quickly'],
    moveWhen: 'The employee can propose workable solutions before the manager provides the answer.',
  },
  S3: {
    id: 'S3',
    objective: 'Transfer decision-making responsibility and build confidence.',
    actions: [
      'Stop giving detailed instructions.',
      'Ask: "How would you handle this?"',
      'Act as a sounding board rather than the answer provider.',
      'Reinforce competence using specific evidence.',
      'Discuss alternatives together.',
      'Let the employee make the final decision.',
    ],
    checkin: 'Weekly or employee-initiated.',
    conversationStarter: "You already know how to handle this. This time, propose your approach first and I'll act as a sounding board.",
    avoid: ['Micromanagement', 'Solving the problem for them', 'Mistaking hesitation for lack of competence'],
    moveWhen: 'Independent decisions and strong results become consistent.',
    extraNote: {
      title: 'If motivation is the problem rather than confidence',
      items: ['Increase autonomy', 'Offer more challenging work', 'Connect the task with development goals'],
    },
  },
  S4: {
    id: 'S4',
    objective: 'Create ownership while maintaining engagement.',
    actions: [
      'Agree on outcomes and boundaries.',
      'Transfer authority.',
      'Let the employee decide how the work is completed.',
      'Recognize contributions.',
      'Offer more challenging responsibilities.',
      'Consider mentoring opportunities.',
    ],
    checkin: 'At major milestones.',
    conversationStarter: "You own this. Let's agree on the outcome and reporting milestones; the approach is yours.",
    avoid: ['Micromanagement', 'Unnecessary approvals', 'Completely disappearing'],
    moveWhen: 'Performance declines or confidence/commitment changes (move back toward S3).',
  },
};

export interface ChecklistItem {
  id: string;
  group: 'TODAY' | 'THIS WEEK' | 'END OF WEEK';
  text: string;
}

export const CHECKLIST_BY_STYLE: Record<StyleId, ChecklistItem[]> = {
  S1: [
    { id: 'define-good', group: 'TODAY', text: 'Define what a strong result looks like and break the task into steps.' },
    { id: 'demo-step', group: 'THIS WEEK', text: 'Demonstrate or walk through the first step together.' },
    { id: 'set-milestone', group: 'THIS WEEK', text: 'Set a deadline for the first milestone.' },
    { id: 'give-feedback', group: 'THIS WEEK', text: 'Give immediate feedback after each completed step.' },
    { id: 'review-standard', group: 'END OF WEEK', text: 'Review progress against the standard and adjust next steps.' },
  ],
  S2: [
    { id: 'ask-struggle', group: 'TODAY', text: 'Ask where the employee is struggling most right now.' },
    { id: 'checkins', group: 'THIS WEEK', text: 'Hold 2-3 short check-ins focused on obstacles.' },
    { id: 'explain-why', group: 'THIS WEEK', text: 'Explain the "why" behind your guidance.' },
    { id: 'recognize-improvement', group: 'THIS WEEK', text: 'Recognize any small improvement you notice.' },
    { id: 'propose-part', group: 'END OF WEEK', text: 'Ask the employee to propose one part of the solution themselves.' },
  ],
  S3: [
    { id: 'propose-solution', group: 'TODAY', text: 'Ask the employee to propose their own solution.' },
    { id: 'transfer-decision', group: 'THIS WEEK', text: 'Transfer one task-related decision to them.' },
    { id: 'evidence-recognition', group: 'THIS WEEK', text: 'Give specific evidence-based recognition.' },
    { id: 'obstacle-checkin', group: 'THIS WEEK', text: 'Hold one check-in focused on obstacles rather than instructions.' },
    { id: 'review-confidence', group: 'END OF WEEK', text: 'Review whether confidence and independence improved.' },
  ],
  S4: [
    { id: 'agree-outcome', group: 'TODAY', text: 'Agree on the outcome and boundaries for this task.' },
    { id: 'transfer-authority', group: 'THIS WEEK', text: 'Transfer full authority for how the work gets done.' },
    { id: 'recognize-ownership', group: 'THIS WEEK', text: 'Recognize their ownership publicly.' },
    { id: 'offer-challenge', group: 'THIS WEEK', text: 'Offer one more challenging responsibility.' },
    { id: 'milestone-checkin', group: 'END OF WEEK', text: 'Check in only at the agreed milestone — resist intervening early.' },
  ],
};
