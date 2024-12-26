import React from 'react';
import {
  FaGithub,
  FaInstagram,
  FaLinkedin,
  FaSquareFacebook,
  FaXTwitter,
} from 'react-icons/fa6';

interface SocialLinks {
  linkedin?: string;
  twitter?: string;
  github?: string;
  facebook?: string;
  instagram?: string;
  [key: string]: string | undefined;
}

interface AdditionalInfo {
  bio?: string;
  social?: SocialLinks;
}

interface Profile {
  additionalInfo?: string;
}

interface AboutEmployeeProps {
  profile?: Profile;
}

const AboutEmployee: React.FC<AboutEmployeeProps> = ({ profile }) => {
  const additionalInfo = profile?.additionalInfo;

  if (!additionalInfo) {
    return (
      <div className='bg-teal-50 shadow-lg rounded-lg p-6 space-y-6 mt-4'>
        <p className='text-teal-600 text-center'>
          No additional information provided.
        </p>
      </div>
    );
  }

  let parsedInfo: AdditionalInfo | null = null;

  try {
    parsedInfo = JSON.parse(additionalInfo);
  } catch (error) {
    console.error('Error parsing additionalInfo:', error);
    return (
      <p className='text-red-500 text-center'>
        Error loading additional information.
      </p>
    );
  }

  const socialIcons: Record<string, React.ReactNode> = {
    linkedin: <FaLinkedin />,
    twitter: <FaXTwitter />,
    github: <FaGithub />,
    facebook: <FaSquareFacebook />,
    instagram: <FaInstagram />,
  };

  return (
    <div className='bg-white shadow-lg rounded-lg p-6 space-y-6 mt-4'>
      {/* Bio Section */}
      {parsedInfo?.bio && (
        <div className='text-teal-800 text-lg leading-relaxed'>
          <h2 className='text-teal-700 font-semibold mb-4 text-base'>
            About me:
          </h2>
          <p>{parsedInfo.bio}</p>
        </div>
      )}

      {/* Social Links Section */}
      {parsedInfo?.social && (
        <div>
          <h2 className='text-teal-700 font-semibold mb-4 text-base'>
            Connect with me:
          </h2>
          <div className='flex flex-wrap gap-4'>
            {Object.entries(parsedInfo.social).map(
              ([platform, link]) =>
                link && (
                  <a
                    key={platform}
                    href={link}
                    target='_blank'
                    rel='noopener noreferrer'
                    className='flex items-center justify-center w-12 h-12 rounded-full bg-gray-50 hover:bg-teal-100 text-teal-600 hover:text-teal-800 shadow-md transition-transform transform hover:scale-110'
                    title={platform.charAt(0).toUpperCase() + platform.slice(1)}
                  >
                    {socialIcons[platform.toLowerCase()]}
                  </a>
                ),
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AboutEmployee;
