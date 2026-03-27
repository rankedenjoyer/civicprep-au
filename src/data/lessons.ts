import { Lesson } from '../types';

export const LESSONS: Lesson[] = [
  // ── Australia and Its People ─────────────────────────────────────
  {
    id: 'aap-1',
    topicId: 'australia-and-its-people',
    title: 'The Land of Australia',
    order: 1,
    summary:
      "Australia is the world's sixth-largest country and the only nation that occupies an entire continent. It lies in the Southern Hemisphere between the Pacific and Indian Oceans.",
    keyPoints: [
      'Australia is both a country and a continent.',
      "It is the sixth-largest country in the world by area.",
      "The capital city is Canberra.",
      "Australia's national language is English.",
      'The population is approximately 26 million people.',
      'Australia is located in the Southern Hemisphere.',
      'The country has six states and two main territories.',
    ],
  },
  {
    id: 'aap-2',
    topicId: 'australia-and-its-people',
    title: 'First Australians',
    order: 2,
    summary:
      "Aboriginal and Torres Strait Islander peoples are the first Australians. They have lived on this land for at least 65,000 years and have the world's oldest continuous cultures.",
    keyPoints: [
      'Aboriginal and Torres Strait Islander peoples are the first Australians.',
      'They have lived in Australia for at least 65,000 years.',
      "They have the world's oldest continuous cultures.",
      'There are hundreds of Aboriginal language groups.',
      'Torres Strait Islander peoples come from the islands between Queensland and Papua New Guinea.',
      'NAIDOC Week celebrates Indigenous cultures every year.',
      'Reconciliation is an ongoing process in Australia.',
    ],
  },
  {
    id: 'aap-3',
    topicId: 'australia-and-its-people',
    title: "Australia's History and Migration",
    order: 3,
    summary:
      'European settlement began in 1788 when the First Fleet arrived. Australia has since welcomed millions of migrants who have shaped its diverse multicultural society.',
    keyPoints: [
      'The First Fleet arrived in 1788, beginning European settlement.',
      'Captain Arthur Phillip led the First Fleet and became the first Governor of NSW.',
      'The gold rush of the 1850s brought many migrants from around the world.',
      'Australia became a federation on 1 January 1901.',
      'The White Australia Policy was dismantled by the 1970s.',
      'Today Australians come from over 200 countries.',
      'Australia has one of the largest migration programs in the world per capita.',
    ],
  },
  {
    id: 'aap-4',
    topicId: 'australia-and-its-people',
    title: 'National Symbols',
    order: 4,
    summary:
      "Australia's national symbols reflect its history, natural environment, and multicultural identity. Knowing these is essential for the citizenship test.",
    keyPoints: [
      'The national flag has three elements: the Union Jack, the Commonwealth Star, and the Southern Cross.',
      'The national colours are green and gold.',
      'The national anthem is "Advance Australia Fair".',
      'The floral emblem is the golden wattle.',
      'The national gemstone is the opal.',
      "The coat of arms features a kangaroo and an emu.",
      "Neither the kangaroo nor the emu can walk backwards — symbolising forward progress.",
    ],
  },

  // ── Democratic Beliefs, Rights and Liberties ────────────────────
  {
    id: 'dbrl-1',
    topicId: 'democratic-beliefs-rights-liberties',
    title: 'Freedoms in Australia',
    order: 1,
    summary:
      'Australians enjoy a wide range of freedoms protected by law and democratic tradition. These freedoms come with responsibilities.',
    keyPoints: [
      'Freedom of speech — the right to express opinions.',
      'Freedom of religion — the right to practise any religion, or none.',
      'Freedom of association — the right to join groups and organisations.',
      'Freedom of movement — the right to move freely within and outside Australia.',
      'Freedom from fear — the right to live without intimidation.',
      'Equality before the law applies to all people regardless of background.',
      'These freedoms are balanced by responsibilities to others and to the law.',
    ],
  },
  {
    id: 'dbrl-2',
    topicId: 'democratic-beliefs-rights-liberties',
    title: 'Rights and Responsibilities',
    order: 2,
    summary:
      'Australian citizens have important rights and responsibilities. Voting is both a right and a legal responsibility for citizens aged 18 and over.',
    keyPoints: [
      'Citizens have the right to vote in federal, state, and local elections.',
      'Voting is compulsory for citizens aged 18 and over.',
      'Citizens can apply for an Australian passport.',
      'Citizens can seek election to parliament.',
      'Responsibilities include obeying Australian law.',
      'Citizens must defend Australia if required.',
      'Citizens should serve on a jury if called upon.',
    ],
  },
  {
    id: 'dbrl-3',
    topicId: 'democratic-beliefs-rights-liberties',
    title: 'The Australian Citizenship Pledge',
    order: 3,
    summary:
      "When becoming a citizen, applicants make a pledge to share Australian values and uphold Australia's democratic beliefs and laws.",
    keyPoints: [
      'The pledge is made at a citizenship ceremony.',
      'Applicants pledge loyalty to Australia and its people.',
      "They commit to uphold Australian democratic beliefs, rights and liberties.",
      'They agree to respect Australian law.',
      'The pledge replaces allegiance to any other country.',
      'Citizenship ceremonies are held by local councils.',
      'Australia Day (26 January) is the most common day for ceremonies.',
    ],
  },

  // ── Government and the Law ───────────────────────────────────────
  {
    id: 'gal-1',
    topicId: 'government-and-law',
    title: 'Three Levels of Government',
    order: 1,
    summary:
      "Australia has three levels of government: federal (national), state/territory, and local. Each has distinct responsibilities.",
    keyPoints: [
      'Federal government handles national issues: defence, immigration, foreign affairs, social security, trade.',
      'State and territory governments handle: education, hospitals, roads, police, public transport.',
      'Local governments (councils) handle: local roads, parks, waste collection, building approvals.',
      'There are six states: NSW, VIC, QLD, WA, SA, TAS.',
      'There are two main territories: ACT and NT.',
      'Parliament meets in Canberra, the national capital.',
      'Each level of government has its own parliament or council.',
    ],
  },
  {
    id: 'gal-2',
    topicId: 'government-and-law',
    title: 'The Australian Constitution and Democracy',
    order: 2,
    summary:
      "The Australian Constitution is the rule book for how Australia is governed. It came into force on 1 January 1901 when the colonies federated.",
    keyPoints: [
      'The Constitution came into force on 1 January 1901.',
      'It sets out the powers and structure of the federal government.',
      'It can only be changed by a referendum.',
      'A referendum requires a national vote — a double majority (majority of all voters AND majority in at least 4 of 6 states).',
      'Australia is a constitutional monarchy and parliamentary democracy.',
      'The separation of powers divides government into legislature, executive, and judiciary.',
      'No one is above the law in Australia.',
    ],
  },
  {
    id: 'gal-3',
    topicId: 'government-and-law',
    title: "The Parliament and Head of State",
    order: 3,
    summary:
      "Australia's federal parliament has two houses. The monarch's representative in Australia is the Governor-General.",
    keyPoints: [
      'The Parliament has two houses: the Senate and the House of Representatives.',
      'The House of Representatives is the lower house — government is formed here.',
      'The Senate is the upper house — it reviews legislation.',
      'There are 151 seats in the House of Representatives.',
      'There are 76 senators.',
      'The King of Australia is King Charles III.',
      'The Governor-General represents the King in Australia.',
    ],
  },
  {
    id: 'gal-4',
    topicId: 'government-and-law',
    title: 'The Legal System and Voting',
    order: 4,
    summary:
      'Australia has an independent judiciary. Voting is compulsory, and elections use preferential voting.',
    keyPoints: [
      "The High Court is Australia's highest court.",
      'Courts are independent of the government.',
      'Everyone is equal before the law.',
      'Voting is compulsory for citizens 18 and over.',
      'Preferential voting is used in the House of Representatives.',
      'Proportional representation is used in the Senate.',
      'Elections must be held at least every three years for the federal government.',
    ],
  },

  // ── Australian Values ────────────────────────────────────────────
  {
    id: 'av-1',
    topicId: 'australian-values',
    title: 'Core Australian Values',
    order: 1,
    summary:
      'Australian values are the shared principles that guide how people treat each other and how they engage with society and government.',
    keyPoints: [
      'Respect for the equal worth, dignity and freedom of every individual.',
      'Freedom of speech and expression.',
      'Freedom of religion and secular government.',
      'Support for parliamentary democracy and the rule of law.',
      'Equality of men and women.',
      'A spirit of a "fair go" — everyone deserves a chance.',
      'A commitment to the rule of law — no one is above the law.',
    ],
  },
  {
    id: 'av-2',
    topicId: 'australian-values',
    title: 'Living Australian Values',
    order: 2,
    summary:
      'Values are not just words — they shape daily life, community interactions, and how Australia welcomes people from all backgrounds.',
    keyPoints: [
      'Acceptance of others regardless of background, religion, or culture.',
      'Mateship — looking out for others, particularly in times of need.',
      'Equality of opportunity — everyone can get ahead through hard work.',
      'Peaceful resolution of conflict.',
      'Violence, intimidation, and discrimination are unacceptable.',
      'Respect for the rights of women and children.',
      "Obedience to Australian law takes precedence over other customs or beliefs.",
    ],
  },
];
