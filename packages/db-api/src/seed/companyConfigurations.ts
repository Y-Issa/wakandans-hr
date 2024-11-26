import { writePrisma } from '../prisma';

export const seedCompanyConfigurations = async () => {
  await writePrisma.companyConfiguration.create({
    data: {
      companyId: 1,
      logo: 'https://www.example.com/logo.png',
      description: 'This is the company description',
      website: 'https://www.example.com',
    },
  });
};

export const seedCompanyConfigurationsDaysOff = async () => {
  await writePrisma.companyConfigurationDayOff.create({
    data: {
      companyConfigurationId: 1,
      dayOffId: 1,
    },
  });
  await writePrisma.companyConfigurationDayOff.create({
    data: {
      companyConfigurationId: 1,
      dayOffId: 2,
    },
  });
  await writePrisma.companyConfigurationDayOff.create({
    data: {
      companyConfigurationId: 1,
      dayOffId: 5,
    },
  });
};
