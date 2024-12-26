import React, { useState } from 'react';

interface ProfileData {
  id: number;
  dateOfBirth?: string;
  profileImage?: string;
  title?: string;
  additionalInfo?: {
    bio?: string;
    social?: {
      linkedin?: string;
      twitter?: string;
      facebook?: string;
      instagram?: string;
      github?: string;
      [key: string]: string | undefined;
    };
  };
}

interface EditProfileFormProps {
  initialProfile: ProfileData;
  onSubmit: (updatedProfile: ProfileData) => void;
  onClose?: () => void;
}

const EditProfileForm: React.FC<EditProfileFormProps> = ({
  initialProfile,
  onSubmit,
  onClose,
}) => {
  const [profile, setProfile] = useState<ProfileData>({
    ...initialProfile,
    additionalInfo: {
      bio: initialProfile.additionalInfo?.bio || '',
      social: {
        linkedin: initialProfile.additionalInfo?.social?.linkedin || '',
        twitter: initialProfile.additionalInfo?.social?.twitter || '',
        facebook: initialProfile.additionalInfo?.social?.facebook || '',
        instagram: initialProfile.additionalInfo?.social?.instagram || '',
        github: initialProfile.additionalInfo?.social?.github || '',
      },
    },
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;

    if (name.startsWith('additionalInfo.social.')) {
      const socialKey = name.split('.')[2];
      setProfile((prev) => ({
        ...prev,
        additionalInfo: {
          ...prev.additionalInfo,
          social: {
            ...prev.additionalInfo?.social,
            [socialKey]: value,
          },
        },
      }));
    } else if (name === 'additionalInfo.bio') {
      setProfile((prev) => ({
        ...prev,
        additionalInfo: {
          ...prev.additionalInfo,
          bio: value,
        },
      }));
    } else if (name === 'dateOfBirth') {
      console.log(new Date(value).toISOString());
      setProfile((prev) => ({
        ...prev,
        dateOfBirth: new Date(value).toISOString(),
      }));
    } else {
      setProfile((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(profile);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className='bg-white p-6 rounded-md shadow-lg space-y-6'
    >
      <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
        <div className='space-y-6'>
          <div>
            <label className='block text-sm font-medium text-teal-700'>
              Bio
            </label>
            <textarea
              name='additionalInfo.bio'
              value={profile.additionalInfo?.bio || ''}
              onChange={handleInputChange}
              className='w-full mt-1 p-2 border rounded-md'
              rows={4}
              placeholder='Tell us something about yourself...'
            />
          </div>

          <div>
            <label className='block text-sm font-medium text-teal-700'>
              Title
            </label>
            <input
              type='text'
              name='title'
              value={profile.title || ''}
              onChange={handleInputChange}
              className='w-full mt-1 p-2 border rounded-md'
              placeholder='Your job title'
            />
          </div>

          <div>
            <label className='block text-sm font-medium text-teal-700'>
              Date of Birth
            </label>
            <input
              type='date'
              name='dateOfBirth'
              value={profile.dateOfBirth?.slice(0, 10) || ''}
              onChange={handleInputChange}
              className='w-full mt-1 p-2 border rounded-md'
            />
          </div>

          <div>
            <label className='block text-sm font-medium text-teal-700'>
              Profile Image URL
            </label>
            <input
              type='text'
              name='profileImage'
              value={profile.profileImage || ''}
              onChange={handleInputChange}
              className='w-full mt-1 p-2 border rounded-md'
              placeholder='URL to your profile image'
            />
          </div>
        </div>

        <div>
          <label className='block text-sm font-medium text-teal-700'>
            Social Links
          </label>
          <div className='space-y-2 mt-2'>
            {['linkedin', 'twitter', 'facebook', 'instagram', 'github'].map(
              (platform) => (
                <input
                  key={platform}
                  type='text'
                  name={`additionalInfo.social.${platform}`}
                  value={profile.additionalInfo?.social?.[platform] || ''}
                  onChange={handleInputChange}
                  className='w-full p-2 border rounded-md'
                  placeholder={`${platform.charAt(0).toUpperCase() + platform.slice(1)} URL (Optional)`}
                />
              ),
            )}
          </div>
        </div>
      </div>

      <div className='flex justify-end gap-4'>
        <button
          onClick={onClose}
          className='bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300 transition-all'
        >
          Cancel
        </button>
        <button
          type='submit'
          className='bg-teal-600 text-white px-4 py-2 rounded-md hover:bg-teal-700 transition-all'
        >
          Save Changes
        </button>
      </div>
    </form>
  );
};

export default EditProfileForm;
