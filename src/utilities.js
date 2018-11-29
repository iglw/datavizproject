export function normalizeCountryName(countries, iso3Code, datamapName) {
  return countries[iso3Code] ? countries[iso3Code].gName : datamapName
};