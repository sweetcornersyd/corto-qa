import { books } from './books';

export const searchCases = [
  {
    name: 'lowercase partial title',
    query: 'git',
    expectedTitles: [books.gitPocketGuide.title],
  },
  {
    name: 'uppercase partial title',
    query: 'GIT',
    expectedTitles: [books.gitPocketGuide.title],
  },
  {
    name: 'partial title with spaces and lowercase',
    query: 'git pocket',
    expectedTitles: [books.gitPocketGuide.title],
  },
  {
    name: 'mixed-case multiword partial title',
    query: 'Git Pocket',
    expectedTitles: [books.gitPocketGuide.title],
  },
  {
    name: 'full title',
    query: books.gitPocketGuide.title,
    expectedTitles: [books.gitPocketGuide.title],
  },
  {
    name: 'author with uppercase partial name',
    query: 'AXEL',
    expectedTitles: [books.speakingJavaScript.title],
  },
  {
    name: 'author with spaces and lowercase',
    query: 'axel rauschmayer',
    expectedTitles: [books.speakingJavaScript.title],
  },
  {
    name: 'author with capitalised/mixed case',
    query: 'Axel Rauschmayer',
    expectedTitles: [books.speakingJavaScript.title],
  },
  {
    name: 'author with lowercase last name',
    query: 'rauschmayer',
    expectedTitles: [books.speakingJavaScript.title],
  },
  { 
    name: 'publisher with lowercase name',
    query: 'press',
    expectedTitles: [
        books.eloquentJavaScript.title,
        books.ecmascript6.title, 
    ],
    },
  {
    name: 'publisher with capitalised/mixed case name',
    query: 'Press',
    expectedTitles: [
        books.eloquentJavaScript.title,
        books.ecmascript6.title, 
    ],
  },
  {
    name: 'publisher with capital letters',
    query: 'PRESS',
    expectedTitles: [
        books.eloquentJavaScript.title,
        books.ecmascript6.title, 
    ],
  },
  {
    name: 'full publisher name',
    query: 'No Starch Press',
    expectedTitles: [
        books.eloquentJavaScript.title,
        books.ecmascript6.title, 
    ],
  },
];
