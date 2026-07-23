import { httpClient } from "./axiosInstance";

/**
 * Fetch all countries with ISO2 codes and phone dialing codes
 * @returns {Promise<Array<{name: string, iso2: string, phoneCode: string}>>}
 */
export const getCountries = async () => {
  try {
    const response = await httpClient.get("/location/countries");
    return response.data?.data || [];
  } catch (error) {
    console.error("Error fetching countries:", error);
    throw error;
  }
};

/**
 * Fetch cities for a specific country by its ISO2 code (e.g., 'PK', 'US')
 * @param {string} countryIso - The ISO2 code of the country
 * @returns {Promise<Array<string>>}
 */
export const getCitiesByCountry = async (countryIso) => {
  if (!countryIso) return [];
  try {
    const response = await httpClient.get(`/location/cities/${countryIso}`);
    return response.data?.data || [];
  } catch (error) {
    console.error(`Error fetching cities for ${countryIso}:`, error);
    throw error;
  }
};

/**
 * Fetch the phone/dial code for a specific country by its ISO2 code (e.g., 'PK', 'US')
 * @param {string} countryIso - The ISO2 code of the country
 * @returns {Promise<{name: string, iso2: string, phoneCode: string}>}
 */
export const getPhoneCodeByCountry = async (countryIso) => {
  if (!countryIso) return null;
  try {
    const response = await httpClient.get(`/location/phonecode/${countryIso}`);
    return response.data?.data || null;
  } catch (error) {
    console.error(`Error fetching  phone code for ${countryIso}:`, error);
    throw error;
  }
};