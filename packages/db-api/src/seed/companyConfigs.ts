import { writePrisma } from '../prisma';

export const seedCompanyConfigurations = async () => {
  const configurations = [
    {
      companyId: 1,
      locationId: 1,
      logo: 'https://www.example.com/logo1.png',
      description: 'Company configuration for Location 1',
      website: 'https://location1.example.com',
    },
    {
      companyId: 1,
      locationId: 2,
      logo: 'https://www.example.com/logo2.png',
      description: 'Company configuration for Location 2',
      website: 'https://location2.example.com',
    },
    {
      companyId: 1,
      locationId: null,
      logo: 'https://www.example.com/logo-global.png',
      description: 'Global company configuration',
      website: 'https://www.example.com',
    },
  ];

  for (const config of configurations) {
    await writePrisma.companyConfiguration.create({
      data: {
        ...config,
      },
    });
  }
};

export const seedCompanyConfigurationsDaysOff = async () => {
  const daysOffMappings = [
    { companyConfigurationId: 1, dayOffId: 1 },
    { companyConfigurationId: 1, dayOffId: 2 },
    { companyConfigurationId: 2, dayOffId: 3 },
    { companyConfigurationId: 3, dayOffId: 4 },
    { companyConfigurationId: 3, dayOffId: 5 },
  ];

  for (const mapping of daysOffMappings) {
    await writePrisma.companyConfigurationDayOff.create({
      data: {
        ...mapping,
      },
    });
  }
};
