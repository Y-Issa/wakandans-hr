import { writePrisma, adminPrisma } from '../prisma';

const profiles = [
  {
    userId: 1,
    title: 'Head of Engineering',
    dateOfBirth: '2000-08-29T10:15:30.000Z',
    employedAt: '2022-08-29T10:15:30.000Z',
    profileImage: 'https://avatars.githubusercontent.com/u/2188008?v=4',
    additionalInfo:
      '{"bio": "I love to play the guitar and I\'m a huge fan of the Beatles.", "social": {"linkedin": "https://www.linkedin.com/in/john-lennon", "twitter": "https://twitter.com/johnlennon, "instagram": "https://instagram.com/, "facebook": "https://facebook.com/, "github": "https://guthib.com/"}}',
  },
  {
    userId: 2,
    title: 'Chief Operating Officer',
    dateOfBirth: '1985-12-15T10:15:30.000Z',
    employedAt: '2020-01-05T10:15:30.000Z',
    profileImage: null,
    additionalInfo:
      '{"bio": "Passionate about scaling businesses and mentoring.", "social": {"linkedin": "https://linkedin.com/in/josh-hanks", "twitter": "https://twitter.com/joshhanks"}}',
  },
  {
    userId: 3,
    title: 'HR Manager',
    dateOfBirth: '1990-05-20T10:15:30.000Z',
    employedAt: '2021-04-10T10:15:30.000Z',
    profileImage: null,
    additionalInfo:
      '{"bio": "Creating happy workplaces one day at a time.", "social": {"linkedin": "https://linkedin.com/in/dany-drac", "twitter": null}}',
  },
  {
    userId: 4,
    title: 'Product Manager',
    dateOfBirth: '1992-11-10T10:15:30.000Z',
    employedAt: '2019-03-12T10:15:30.000Z',
    profileImage: null,
    additionalInfo:
      '{"bio": "Building great products with great teams.", "social": {"linkedin": "https://linkedin.com/in/james-brown", "twitter": null}}',
  },
  {
    userId: 5,
    title: 'Software Engineer',
    dateOfBirth: '1995-07-01T10:15:30.000Z',
    employedAt: '2023-02-18T10:15:30.000Z',
    profileImage: null,
    additionalInfo:
      '{"bio": "Enthusiastic about coding and hackathons.", "social": {"linkedin": "https://linkedin.com/in/olivia-jones", "twitter": "https://twitter.com/oliviajones"}}',
  },
  {
    userId: 6,
    title: 'Data Scientist',
    dateOfBirth: '1993-03-15T10:15:30.000Z',
    employedAt: '2021-06-01T10:15:30.000Z',
    profileImage: null,
    additionalInfo:
      '{"bio": "Loves analyzing data and finding patterns.", "social": {"linkedin": "https://linkedin.com/in/sam-smith", "twitter": "https://twitter.com/samsmith"}}',
  },
  {
    userId: 7,
    title: 'Marketing Specialist',
    dateOfBirth: '1988-09-25T10:15:30.000Z',
    employedAt: '2018-11-20T10:15:30.000Z',
    profileImage: null,
    additionalInfo:
      '{"bio": "Expert in digital marketing and SEO.", "social": {"linkedin": "https://linkedin.com/in/anna-jones", "twitter": "https://twitter.com/annajones"}}',
  },
  {
    userId: 8,
    title: 'Sales Manager',
    dateOfBirth: '1985-07-30T10:15:30.000Z',
    employedAt: '2017-09-15T10:15:30.000Z',
    profileImage: null,
    additionalInfo:
      '{"bio": "Passionate about sales and customer relationships.", "social": {"linkedin": "https://linkedin.com/in/mike-jordan", "twitter": "https://twitter.com/mikejordan"}}',
  },
  {
    userId: 9,
    title: 'UX Designer',
    dateOfBirth: '1991-04-12T10:15:30.000Z',
    employedAt: '2020-02-25T10:15:30.000Z',
    profileImage: null,
    additionalInfo:
      '{"bio": "Designing intuitive user experiences.", "social": {"linkedin": "https://linkedin.com/in/lisa-wong", "twitter": "https://twitter.com/lisawong"}}',
  },
  {
    userId: 10,
    title: 'DevOps Engineer',
    dateOfBirth: '1989-11-05T10:15:30.000Z',
    employedAt: '2019-08-10T10:15:30.000Z',
    profileImage: null,
    additionalInfo:
      '{"bio": "Ensuring smooth deployment and operations.", "social": {"linkedin": "https://linkedin.com/in/mark-lee", "twitter": "https://twitter.com/marklee"}}',
  },
  {
    userId: 11,
    title: 'QA Engineer',
    dateOfBirth: '1994-02-18T10:15:30.000Z',
    employedAt: '2022-01-15T10:15:30.000Z',
    profileImage: null,
    additionalInfo:
      '{"bio": "Passionate about software quality and testing.", "social": {"linkedin": "https://linkedin.com/in/sara-khan", "twitter": "https://twitter.com/sarakhan"}}',
  },
  {
    userId: 12,
    title: 'Business Analyst',
    dateOfBirth: '1987-06-22T10:15:30.000Z',
    employedAt: '2016-05-10T10:15:30.000Z',
    profileImage: null,
    additionalInfo:
      '{"bio": "Analyzing business needs and requirements.", "social": {"linkedin": "https://linkedin.com/in/john-doe", "twitter": "https://twitter.com/johndoe"}}',
  },
  {
    userId: 13,
    title: 'Customer Support',
    dateOfBirth: '1996-10-10T10:15:30.000Z',
    employedAt: '2023-03-05T10:15:30.000Z',
    profileImage: null,
    additionalInfo:
      '{"bio": "Helping customers with their issues.", "social": {"linkedin": "https://linkedin.com/in/jane-doe", "twitter": "https://twitter.com/janedoe"}}',
  },
  {
    userId: 14,
    title: 'Network Engineer',
    dateOfBirth: '1990-12-01T10:15:30.000Z',
    employedAt: '2020-07-20T10:15:30.000Z',
    profileImage: null,
    additionalInfo:
      '{"bio": "Ensuring network stability and security.", "social": {"linkedin": "https://linkedin.com/in/paul-smith", "twitter": "https://twitter.com/paulsmith"}}',
  },
  {
    userId: 15,
    title: 'Graphic Designer',
    dateOfBirth: '1992-08-14T10:15:30.000Z',
    employedAt: '2019-11-25T10:15:30.000Z',
    profileImage: null,
    additionalInfo:
      '{"bio": "Creating visually appealing designs.", "social": {"linkedin": "https://linkedin.com/in/emily-jones", "twitter": "https://twitter.com/emilyjones"}}',
  },
  {
    userId: 16,
    title: 'Content Writer',
    dateOfBirth: '1993-05-18T10:15:30.000Z',
    employedAt: '2021-09-10T10:15:30.000Z',
    profileImage: null,
    additionalInfo:
      '{"bio": "Writing engaging content for various platforms.", "social": {"linkedin": "https://linkedin.com/in/oliver-brown", "twitter": "https://twitter.com/oliverbrown"}}',
  },
  {
    userId: 17,
    title: 'IT Support',
    dateOfBirth: '1988-03-22T10:15:30.000Z',
    employedAt: '2018-06-15T10:15:30.000Z',
    profileImage: null,
    additionalInfo:
      '{"bio": "Providing technical support to employees.", "social": {"linkedin": "https://linkedin.com/in/nina-williams", "twitter": "https://twitter.com/ninawilliams"}}',
  },
  {
    userId: 18,
    title: 'Project Manager',
    dateOfBirth: '1985-01-10T10:15:30.000Z',
    employedAt: '2017-04-20T10:15:30.000Z',
    profileImage: null,
    additionalInfo:
      '{"bio": "Managing projects and ensuring timely delivery.", "social": {"linkedin": "https://linkedin.com/in/kevin-johnson", "twitter": "https://twitter.com/kevinjohnson"}}',
  },
  {
    userId: 19,
    title: 'System Administrator',
    dateOfBirth: '1991-07-25T10:15:30.000Z',
    employedAt: '2020-10-05T10:15:30.000Z',
    profileImage: null,
    additionalInfo:
      '{"bio": "Maintaining and configuring computer systems.", "social": {"linkedin": "https://linkedin.com/in/amy-davis", "twitter": "https://twitter.com/amydavis"}}',
  },
  {
    userId: 20,
    title: 'Financial Analyst',
    dateOfBirth: '1989-11-30T10:15:30.000Z',
    employedAt: '2019-02-15T10:15:30.000Z',
    profileImage: null,
    additionalInfo:
      '{"bio": "Analyzing financial data and trends.", "social": {"linkedin": "https://linkedin.com/in/robert-miller", "twitter": "https://twitter.com/robertmiller"}}',
  },
];

const privateProfiles = [
  {
    userId: 1,
    salary: 2300,
    address: 'Amchit, building 100, 2nd floor',
    phoneNumber: '+961 70 123 456',
    secondaryPhoneNumber: '+961 70 654 321',
    secondaryEmail: 'alexiakl@gmail.com',
    emergencyContactName: 'John Doe',
    emergencyContactNumber: '+961 70 987 654',
  },
];

export const seedProfiles = async () => {
  await Promise.all(
    profiles.map(
      async (profile) =>
        await writePrisma.profile.create({
          data: {
            ...profile,
          },
        }),
    ),
  );

  await Promise.all(
    privateProfiles.map(
      async (profile) =>
        await adminPrisma.privateProfile.create({
          data: {
            ...profile,
          },
        }),
    ),
  );
};
