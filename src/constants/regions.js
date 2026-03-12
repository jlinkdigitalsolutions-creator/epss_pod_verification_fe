export const REGIONS = {
  ADD: {
    english: 'Addis Ababa City Administration Finance Bureau',
    amharic: 'አዲስ አበባ ከተማ አስተዳደር የገንዘብ ቢሮ',
  },
  AFR: {
    english: 'Afar National Regional State Finance and Economic Development Bureau',
    amharic: 'አፋር ብሔራዊ ክልላዊ መንግሥት የገንዘብና ኢኮኖሚ ትብብር ቢሮ',
  },
  AMH: {
    english: 'Amhara Regional State Bureau of Finance and Economic Cooperation',
    amharic: 'አማራ ብሔራዊ ክልላዊ መንግሥት የገንዘብና ኢኮኖሚ ትብብር ቢሮ',
  },
  BEN: {
    english: 'Benishangul-Gumuz National Regional State Finance and Economic Development Bureau',
    amharic: 'ቤኒሻንጉል ጉምዝ ብሔራዊ ክልላዊ መንግሥት የገንዘብና ኢኮኖሚ ትብብር ቢሮ',
  },
  DIR: {
    english: 'Dire Dawa City Administration Finance Bureau',
    amharic: 'ድሬዳዋ ከተማ አስተዳደር የገንዘብ ቢሮ',
  },
  GAM: {
    english: 'Gambella Peoples National Regional State Finance and Economic Development Bureau',
    amharic: 'ጋምቤላ ሕዝቦች ብሔራዊ ክልላዊ መንግሥት የገንዘብና ኢኮኖሚ ትብብር ቢሮ',
  },
  HAR: {
    english: 'Harari National Regional State Finance and Economic Development Bureau',
    amharic: 'ሐረሪ ብሔራዊ ክልላዊ መንግሥት የገንዘብና ኢኮኖሚ ትብብር ቢሮ',
  },
  ORO: {
    english: 'Oromia National Regional State Finance and Economic Cooperation Bureau',
    amharic: 'ኦሮሚያ ብሔራዊ ክልላዊ መንግሥት የገንዘብና ኢኮኖሚ ትብብር ቢሮ',
  },
  SID: {
    english: 'Sidama National Regional State Finance and Economic Development Bureau',
    amharic: 'ሲዳማ ብሔራዊ ክልላዊ መንግሥት የገንዘብና ኢኮኖሚ ትብብር ቢሮ',
  },
  SOM: {
    english: 'Somali National Regional State Finance and Economic Development Bureau',
    amharic: 'ሶማሌ ብሔራዊ ክልላዊ መንግሥት የገንዘብና ኢኮኖሚ ትብብር ቢሮ',
  },
  SOU: {
    english: 'South Ethiopia Regional State Finance and Economic Development Bureau',
    amharic: 'ደቡብ ኢትዮጵያ ክልላዊ መንግሥት የገንዘብና ኢኮኖሚ ትብብር ቢሮ',
  },
  SWE: {
    english: "South West Ethiopia Peoples' Regional State Finance and Economic Development Bureau",
    amharic: 'ደቡብ ምዕራብ ኢትዮጵያ ሕዝቦች ክልላዊ መንግሥት የገንዘብና ኢኮኖሚ ትብብር ቢሮ',
  },
  TIG: {
    english: 'Tigray National Regional State Finance and Economic Development Bureau',
    amharic: 'ትግራይ ብሔራዊ ክልላዊ መንግሥት የገንዘብና ኢኮኖሚ ትብብር ቢሮ',
  },
  NTN: {
    english: 'Finance and Economic Development Bureau',
    amharic: 'የገንዘብና ኢኮኖሚ ትብብር ቢሮ',
  },
};

export const getRegionInfo = (regionCode) => REGIONS[regionCode] || REGIONS.NTN;
