import { getCountry, getLocales } from '@amazon-devices/react-native-localize';
import { OptionType } from '../components/RadioPicker';
import en from '../translations/en.json';
import es from '../translations/es.json';
import fr from '../translations/fr.json';

const translations: any = {
  en,
  fr,
  es,
};

export const appLocales = ['en-US', 'fr-FR', 'es-ES'];

export const localeOptions = appLocales.map((locale) => {
  const countryCode = locale.split('-');
  return { label: countryCode[1], value: locale, code: countryCode[0] };
});

export const getCurrentCountry = () => {
  return getCountry();
};

//filters locales used in app from complete locale data
export const getAppLocales = () => {
  const filteredLocales = getLocales().filter((locale) => {
    return appLocales.includes(locale.languageTag);
  });
  return filteredLocales;
};

export const translate = (key: string, code: string) => {
  return translations[code][key];
};

export const getSelectedLocale = (): OptionType => {
  const currentCountry = getCurrentCountry();
  return (
    localeOptions.find((item) => item.label === currentCountry) ||
    localeOptions[0]
  );
};
