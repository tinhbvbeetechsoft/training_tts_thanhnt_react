import axios from 'axios';

import { TranslatorContext, Storage } from 'react-jhipster';
import { ActionEntity } from '../Models/ActionEntity';

export const ACTION_TYPES = {
  SET_LOCALE: 'locale/SET_LOCALE'
};

export interface Locale {
    currentLocale?: string
};

const initialState = {
  currentLocale: ''
};

export type LocaleState = Readonly<typeof initialState>;

export default (state: LocaleState = initialState, action: ActionEntity): LocaleState => {
  if (action.type === ACTION_TYPES.SET_LOCALE) {
    const currentLocale: string = action.locale as string;
    if (state.currentLocale !== currentLocale) {
      TranslatorContext.setLocale(currentLocale);
      Storage.session.set('locale', currentLocale);
    }
    return {
      currentLocale: currentLocale
    };
  } else {
    return state;
  }
};

export const setLocale = (locale: string) => async (dispatch: any, getState: any) => {
  if (!Object.keys(TranslatorContext.context.translations).includes(locale)) {
    const response = await axios.get(`/i18n/${locale}.json?buildTimestamp='${new Date().getTime()}'`, { baseURL: '' });
    TranslatorContext.registerTranslations(locale, response.data);
  }
  await dispatch({
    type: ACTION_TYPES.SET_LOCALE,
    locale: locale
  });
};
