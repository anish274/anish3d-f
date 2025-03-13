import { ExternalLink } from '../components/ExternalLink';
import { GitHubIcon } from '../components/icons/GitHubIcon';
import { InstagramIcon } from '../components/icons/InstagramIcon';
import { XIcon } from '../components/icons/XIcon';
import { LinkedInIcon } from '../components/icons/LinkedInIcon';
import anish3dLogoA from '../images/logos/anish3d_A.webp';
import arsenalLogo from '../images/logos/ArsenalTech.svg';
import encoderLogo from '../images/logos/EncoderLab.svg';
import fergusLogo from '../images/logos/Fergus.svg';
import intransureLogo from '../images/logos/INTRA.svg';
import mdLogo from '../images/logos/MD.svg';
import tenerityLogo from '../images/logos/Tenerity.svg';

export const Name = process.env.NEXT_PUBLIC_FULL_NAME;

export const About = (
  <>
    <div dangerouslySetInnerHTML={{ __html: process.env.NEXT_PUBLIC_HOME_PAGE_MY_DETAILS || '' }} />
    <ExternalLink href="mailto:bartosz@jarocki.me">send me an email.</ExternalLink>
  </>
);
export const AboutExtended = (
  <>
    <div dangerouslySetInnerHTML={{ __html: process.env.NEXT_PUBLIC_ABOUT_PAGE_EXTENDED || '' }} />
  </>
);
export const AboutWork = (
  <>
    <div dangerouslySetInnerHTML={{ __html: process.env.NEXT_PUBLIC_ABOUT_PAGE_WORK || '' }} />
  </>
);
export type Project = {
  title: string;
  techStack: string[];
  description: string;
  logo: any;
  link?: {
    label: string;
    href: string;
  };
};

export const MyCurrentProjects: Project[] = [
  {
    title: 'One',
    techStack: ['One', 'One', 'One', 'One'],
    description: 'One.',
    logo: anish3dLogoA,
    link: {
      label: 'anish3d.com',
      href: 'https://anish3d.com',
    },
  },
  {
    title: 'Two',
    techStack: ['One', 'One', 'One', 'One'],
    description: 'One.',
    logo: anish3dLogoA,
    link: {
      label: 'anish3d.com',
      href: 'https://anish3d.com',
    },
  },
  {
    title: 'Three',
    techStack: ['One', 'One', 'One', 'One'],
    description: 'One.',
    logo: anish3dLogoA,
    link: {
      label: 'anish3d.com',
      href: 'https://anish3d.com',
    },
  },
];

export const MyPastProjects: Project[] = [
  {
    title: 'Parabol',
    techStack: ['Full Stack Developer', 'TypeScript', 'React', 'Node.js', 'GraphQL'],
    description: 'The Agile meeting co-pilot that delivers better meetings with less effort.',
    logo: anish3dLogoA,
    link: {
      label: 'github.com',
      href: 'https://github.com/ParabolInc/parabol',
    },
  },
  {
    title: 'Evercast',
    techStack: [
      'Lead Frontend Developer',
      'From scratch',
      'TypeScript',
      'React',
      'Node.js',
      'GraphQL',
    ],
    description:
      'Creative collaboration platform that combines video conferencing and HD media streaming.',
    logo: anish3dLogoA,
    link: {
      label: 'evercast.us',
      href: 'https://www.evercast.us/',
    },
  },
  {
    title: 'Mobile Vikings',
    techStack: ['Lead Android Developer', 'Android', 'Kotlin'],
    description: 'Android application for leading virtual mobile operator in Poland.',
    logo: anish3dLogoA,
    link: {
      label: 'mobilevikings.pl',
      href: 'https://mobilevikings.pl/',
    },
  },
  {
    title: 'Howdy',
    techStack: ['Lead Android Developer', 'Android', 'Kotlin'],
    description: 'Howdy is a place for you to join communities you care about.',
    logo: anish3dLogoA,
    link: {
      label: 'play.google.com',
      href: 'https://play.google.com/store/apps/details?id=com.howdyhub.howdy',
    },
  },
  {
    title: 'Tastycloud',
    techStack: ['Lead Android Developer', 'Android', 'Kotlin'],
    description: 'Android application for managing and displaying restaurant menus in kiosk mode.',
    logo: anish3dLogoA,
    link: {
      label: 'tastycloud.fr',
      href: 'https://www.tastycloud.fr/',
    },
  },
  {
    title: 'Ambit',
    techStack: ['Lead Android Developer', 'Android', 'Kotlin'],
    description: 'Android application that helps with sharing your contact details.',
    logo: anish3dLogoA,
  },
  {
    title: 'Bim',
    techStack: ['Lead Android Developer', 'Android', 'Kotlin'],
    description: 'Android application that helps with booking a table in a restaurants.',
    logo: anish3dLogoA,
  },
  {
    title: 'Canal Digital GO',
    techStack: ['Lead Android Developer', 'Android', 'Kotlin'],
    description: 'Video streaming mobile application for Canal Digital subscribers.',
    logo: anish3dLogoA,
  },
];

export const SocialMedia = [
  { name: 'Twitter', link: 'https://x.com/anish_journey', icon: XIcon},
  { name: 'Instagram', link: 'https://www.instagram.com/anish.journey/', icon: InstagramIcon },
  { name: 'Github', link: 'https://github.com/anish274', icon: GitHubIcon},
  { name: 'LinkedIn', link: 'https://www.linkedin.com/in/anish3d', icon: LinkedInIcon },
] as const;

export const Work = [
  {
    company: 'Tenerity',
    title: 'Delivery Lead',
    logo: tenerityLogo,
    start: '2021',
    end: 'Working',
  },
  {
    company: 'Multidots',
    title: 'Team Lead → Project Manager',
    logo: mdLogo,
    start: '2018',
    end: '2021',
  },
  {
    company: 'Intransure',
    title: 'Software Engineer → Team Lead',
    logo: intransureLogo,
    start: '2015',
    end: '2018',
  },
  {
    company: 'FSTPL',
    title: 'Software Engineer',
    logo: fergusLogo,
    start: '2014',
    end: '2015',
  },
  {
    company: 'Encoder Lab',
    title: 'Sr PHP Developer',
    logo: encoderLogo,
    start: '2013',
    end: '2014',
  },
  {
    company: 'ArsenalTech',
    title: 'PHP Developer',
    logo: arsenalLogo,
    start: '2011',
    end: '2013',
  },
] as const;

export const CompaniesLinks = [
  {
    name: 'VisionMedia',
    link: 'https://www.visionmedia.com/',
  },
  {
    name: 'DKMS',
    link: 'https://www.dkms.org/en',
  },
  {
    name: 'AAA',
    link: 'https://www.aaa.com/',
  },
  {
    name: 'PolskaPress',
    link: 'https://polskapress.pl/pl',
  },
  {
    name: 'Canal Digital',
    link: 'https://www.canaldigital.no/',
  },
] as const;

// Define types for Notion data
export type NotionItem = {
  name: string;
  link: string;
};

export type NotionDataByType = {
  books_collection: NotionItem[];
  videos_collection: NotionItem[];
  podcasts_collection: NotionItem[];
  people_collection: NotionItem[];
  blogs_collection: NotionItem[];
};

// Function to fetch data from Notion
export async function fetchAboutMeData(): Promise<NotionDataByType> {
  try {
    const response = await fetch(`/api/notion`);
    if (!response.ok) {
      throw new Error('Failed to fetch data from Notion');
    }
    
    const data = await response.json();
    
    // Organize data by link type
    const organizedData: NotionDataByType = {
      books_collection: [],
      videos_collection: [],
      podcasts_collection: [],
      people_collection: [],
      blogs_collection: []
    };
    
    data.forEach((item: any) => {
      const linkType = item.linkType;
      const notionItem = {
        name: item.name,
        link: item.directLink
      };
      
      if (organizedData[linkType as keyof NotionDataByType]) {
        organizedData[linkType as keyof NotionDataByType].push(notionItem);
      }
    });
    
    return organizedData;
  } catch (error) {
    console.error('Error fetching Notion data:', error);
    return {
      books_collection: [],
      videos_collection: [],
      podcasts_collection: [],
      people_collection: [],
      blogs_collection: []
    };
  }
}

// Keep the original data as fallbacks
export const Books = [
  {
    name: 'Shoe Dog: A Memoir by the Creator of Nike by Phil Knight',
    link: 'https://www.amazon.com/Shoe-Dog-Memoir-Creator-Nike-ebook/dp/B0176M1A44',
  },
  {
    name: 'The Black Swan: The Impact of the Highly Improbable by Nassim Nicholas Taleb',
    link: 'https://amzn.to/2NwihaS',
  },
  {
    name: 'Antifragile: Things That Gain from Disorder by Nassim Nicholas Taleb',
    link: 'https://amzn.to/3aIG805',
  },
  {
    name: 'Fooled by Randomness: The Hidden Role of Chance in Life and in the Markets by Nassim Nicholas Taleb',
    link: 'https://amzn.to/3kbvaD9',
  },
  {
    name: 'Daily stoic by Ryan Holiday',
    link: 'https://amzn.to/3n8ATuC',
  },
  {
    name: 'A Guide to the Good Life: The Ancient Art of Stoic Joy by William B. Irvine',
    link: 'https://amzn.to/3iuL1ud',
  },
  {
    name: 'Atomic Habits by James Clear',
    link: 'https://amzn.to/3iqimpZ',
  },
] as const;

export const VideosWorthWatching = [
  {
    name: 'Steve Jobs 2005 Stanford Commencement Address',
    link: 'https://www.youtube.com/watch?v=UF8uR6Z6KLc',
  },
  {
    name: 'Falcon Heavy & Starman',
    link: 'https://www.youtube.com/watch?v=A0FZIwabctw',
  },
] as const;

export const Podcasts = [
  {
    name: 'Lex Fridman Podcast',
    link: 'https://www.youtube.com/@lexfridman',
  },
  {
    name: 'Huberman Lab',
    link: 'https://www.youtube.com/@hubermanlab',
  },
  {
    name: 'Joe Rogan',
    link: 'https://www.youtube.com/@joerogan',
  },
  {
    name: 'The Tim Ferriss Show',
    link: 'https://www.youtube.com/channel/UCznv7Vf9nBdJYvBagFdAHWw',
  },
  {
    name: 'Build your SaaS',
    link: 'https://saas.transistor.fm/',
  },
] as const;

export const PeopleWorthFollowingOnTwitter = [
  {
    name: 'Andrew Wilkinson',
    link: 'https://twitter.com/awilkinson',
  },
  {
    name: 'Oliur',
    link: 'https://twitter.com/UltraLinx',
  },
  {
    name: 'Jack Butcher',
    link: 'https://twitter.com/jackbutcher',
  },
  {
    name: 'Sahil Lavingia',
    link: 'https://twitter.com/shl',
  },
  {
    name: 'James Clear',
    link: 'https://twitter.com/JamesClear',
  },
  {
    name: 'Naval',
    link: 'https://twitter.com/naval',
  },
  {
    name: 'Paul Graham',
    link: 'https://twitter.com/paulg',
  },
  {
    name: "John O'Nolan",
    link: 'https://twitter.com/JohnONolan',
  },
  {
    name: 'Jon Yongfook',
    link: 'https://twitter.com/yongfook',
  },
  {
    name: 'Joel Gascoigne',
    link: 'https://twitter.com/joelgascoigne',
  },
  {
    name: 'Pieter Levels',
    link: 'https://twitter.com/levelsio',
  },
] as const;

export const Blogs = [
  {
    name: 'Wait but why',
    link: 'https://waitbutwhy.com/',
  },
  {
    name: 'Paul Graham',
    link: 'http://www.paulgraham.com/',
  },
  {
    name: 'Joel Hooks',
    link: 'https://joelhooks.com',
  },
  {
    name: 'David Perell',
    link: 'https://www.perell.com/',
  },
  {
    name: 'Dan Abramov',
    link: 'https://overreacted.io',
  },
  {
    name: 'Lee Robinson',
    link: 'https://leerob.io',
  },
  {
    name: 'Naval Ravikant',
    link: 'https://nav.al/',
  },
] as const;

export const Quotes = [
  {
    content: 'We have two lives, and the second begins when we realize we only have one.',
    author: '― Confucius',
  },
  {
    content: 'The man who moves a mountain begins by carrying away small stones.',
    author: '― Confucius',
  },
  {
    content:
      'The man who asks a question is a fool for a minute, the man who does not ask is a fool for life.',
    author: '― Confucius',
  },
  {
    content:
      "Twenty years from now you will be more disappointed by the things that you didn't do than by the ones you did so. So throw off the bowlines. Sail away from the safe harbor. Catch the trade winds in your sails. Explore. Dream. Discover.",
    author: '― Mark Twain',
  },
  {
    content:
      "You have no responsibility to live up to what other people think you ought to accomplish. I have no responsibility to be like they expect me to be. It's their mistake, not my failing.",
    author: '― Mark Twain',
  },
  {
    content:
      'Watch your thoughts, they become your words; watch your words, they become your actions; watch your actions, they become your habits; watch your habits, they become your character; watch your character, it becomes your destiny.',
    author: '― Laozi',
  },
  {
    content: 'If you are going through hell, keep going.',
    author: '― Winston S. Churchill',
  },
  {
    content: 'Attitude is a little thing that makes a big difference.',
    author: '― Winston S. Churchill',
  },
  {
    content:
      'To think is easy. To act is hard. But the hardest thing in the world is to act in accordance with your thinking.',
    author: '― Johann Wolfgang von Goethe',
  },
  {
    content: 'It is not death that a man should fear, but he should fear never beginning to live.',
    author: '― Marcus Aurelius',
  },
  {
    content: 'If it is not right do not do it; if it is not true do not say it.',
    author: '― Marcus Aurelius',
  },
  {
    content:
      'You have power over your mind - not outside events. Realize this, and you will find strength.',
    author: '― Marcus Aurelius',
  },
  {
    content: 'The happiness of your life depends upon the quality of your thoughts.',
    author: '― Marcus Aurelius',
  },
  {
    content:
      'If you are distressed by anything external, the pain is not due to the thing itself, but to your estimate of it; and this you have the power to revoke at any moment.',
    author: '― Marcus Aurelius',
  },
  {
    content: 'There is no easy way from the earth to the stars',
    author: '― Seneca',
  },
  {
    content: 'We suffer more often in imagination than in reality',
    author: '― Seneca',
  },
] as const;

export const Tools = {
  Workstation: [
    {
      title: '14” MacBook Pro, M1 Max, 32GB RAM (2021)',
      description:
        'This laptop is a top-of-the-line machine that can handle virtually any task you throw at it, making it a worthwhile investment for anyone looking for a reliable and powerful laptop that can be used for years.',
      href: 'https://amzn.to/3XkWxhF',
    },
    {
      title: 'Apple Studio Display 5K (Standard Glass)',
      description:
        '5K resolution helps to reduce strain on the eyes and makes it more comfortable to work for long periods of time. Not to mention that it looks great.',
      href: 'https://amzn.to/3NnMlAu',
    },
    {
      title: 'Logitech MX Keys Mini',
      description:
        'Backlit keys, compact design, good battery life and a great typing experience. Matches the space gray color of the laptop almost perfectly.',
      href: 'https://amzn.to/3qSUNQS',
    },
    {
      title: 'Logitech MX Master 3',
      description: "Let's be honest, it just looks great with MX Keys Mini keyboard.",
      href: 'https://amzn.to/3qXIvXl',
    },
    {
      title: 'Apple Magic Trackpad',
      description:
        'Gestures, taps and swipes are something I miss when I work with my laptop closed.',
      href: 'https://amzn.to/3pgETza',
    },
    {
      title: 'Apple Magic Mouse',
      description:
        'Because it looks great and it allows me to post pictures with how badly the charging port is designed.',
      href: 'https://amzn.to/43UuA30',
    },
    {
      title: 'Autonomous ErgoChair Pro',
      description: `If I'm going to slouch in the worst ergonomic position imaginable all day, I might as well do it in an expensive chair.`,
      href: 'https://www.autonomous.ai/office-chairs/ergonomic-chair',
    },
  ],
  Software: [
    {
      title: 'Visual Studio Code',
      description: `I still miss WebStorm but at least VS Code does not consume 1000% CPU when I open it. And to be fair, it's a great editor.`,
      href: 'https://code.visualstudio.com/',
    },
    {
      title: 'iTerm2',
      description: `I'm honestly not even sure what features I get with this that aren't just part of the macOS Terminal but it's what I use.`,
      href: 'https://iterm2.com/',
    },
    {
      title: 'TablePlus',
      description: `Great software for working with databases. Has saved me from building about a thousand admin interfaces for my various projects over the years.`,
      href: 'https://tableplus.com/',
    },
    {
      title: 'Figma',
      description: `I'm not a designer but it allows me to quickly mock up interfaces and play with my ideas. One day I'll learn how to use it properly.`,
      href: 'https://www.figma.com/',
    },
    {
      title: 'Notion',
      description: `I use it for everything. I have a separate workspace for each of my projects and I use it to keep track of my tasks, notes, and ideas.`,
      href: 'https://www.notion.so/',
    },
    {
      title: 'Raycast',
      description: `Window management, quick access to my most used apps, and a bunch of other useful features. I use it every day.`,
      href: 'https://www.raycast.com/',
    },
    {
      title: '1Password',
      description: `Not much to say here. It's a great password manager.`,
      href: 'https://1password.com/',
    },
    {
      title: 'Cron',
      description: `Calendar application done right`,
      href: 'https://cron.com/',
    },
  ],
} as const;
