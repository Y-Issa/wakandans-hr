import React from 'react';
import SectionWrapper from './sectionWraper';

interface SocialLinks {
  linkedin?: string;
  twitter?: string;
  [key: string]: string | undefined;
}

interface AdditionalInfo {
  bio?: string;
  social?: SocialLinks;
}

interface AboutEmployeeProps {
  additionalInfo?: string;
}

const AboutEmployee: React.FC<AboutEmployeeProps> = ({ additionalInfo }) => {
  if (!additionalInfo) {
    return <p className='text-gray-500'>No additional information provided.</p>;
  }

  let parsedInfo: AdditionalInfo | null = null;
  // const testString =
  //   "{\n      bio: \"I love to play the guitar and I'm a huge fan of the Beatles.\",\n      social: {\n        linkedin: 'https://www.linkedin.com/in/john-lennon',\n        twitter: 'https://twitter.com/johnlennon',\n      },\n    }";

  try {
    parsedInfo = JSON.parse(additionalInfo);
  } catch (error) {
    console.error('Error parsing additionalInfo:', error);
    return (
      <p className='text-red-500'>Error loading additional information.</p>
    );
  }

  return (
    <SectionWrapper title='About Employee'>
      <div className='space-y-4'>
        {parsedInfo?.bio && <p className='text-gray-700'>{parsedInfo.bio}</p>}
        {parsedInfo?.social && (
          <div className='space-y-2'>
            <h2 className='text-sm font-semibold text-gray-600'>
              Social Links:
            </h2>
            <ul className='list-disc list-inside text-blue-600'>
              {Object.entries(parsedInfo.social).map(
                ([platform, link]) =>
                  link && (
                    <li key={platform}>
                      <a
                        href={link}
                        target='_blank'
                        rel='noopener noreferrer'
                        className='underline hover:text-blue-800'
                      >
                        {platform.charAt(0).toUpperCase() + platform.slice(1)}
                      </a>
                    </li>
                  ),
              )}
            </ul>
          </div>
        )}
      </div>
    </SectionWrapper>
  );
};

export default AboutEmployee;
