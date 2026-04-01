import countryCodes from "@/../assets/data/country_codes.json";

const countryDisplayByCode = new Map(
  countryCodes.map(({ code, emoji, name }) => [
    code.toLowerCase(),
    { emoji, name },
  ])
);

const getCountryDisplayName = (countryCode: string) => {
  const normalizedCountryCode = countryCode.trim().toLowerCase();

  if (!normalizedCountryCode) return "";

  const countryDisplay = countryDisplayByCode.get(normalizedCountryCode);

  if (!countryDisplay) return countryCode.toUpperCase();

  return `${countryDisplay.emoji} ${countryDisplay.name}`;
};

export const getDoctorLicensedCountryPills = (countries?: string[]) => {
  if (!Array.isArray(countries)) return [];

  return countries
    .map((countryCode) => getCountryDisplayName(countryCode))
    .filter(Boolean);
};

export const formatDoctorPrice = (price?: string | number) => {
  if (price === undefined || price === null) return "0";

  const normalizedPrice = String(price).trim();

  if (!normalizedPrice) return "0";

  const numericPrice = Number(normalizedPrice);

  if (Number.isNaN(numericPrice)) {
    return normalizedPrice.replace(/^0+(?=\d)/, "");
  }

  return String(numericPrice);
};
