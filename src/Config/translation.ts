import { TranslatorContext, Storage } from 'react-jhipster';
import { LOCALE_DEFAULT } from '../Constants/constants';
import { setLocale } from '../Services/Reducers/locale';
TranslatorContext.setDefaultLocale(LOCALE_DEFAULT);
TranslatorContext.setRenderInnerTextForMissingKeys(false);

export const registerLocale = (store: any) => {
  store.dispatch(setLocale(Storage.session.get('locale', LOCALE_DEFAULT)));
};
