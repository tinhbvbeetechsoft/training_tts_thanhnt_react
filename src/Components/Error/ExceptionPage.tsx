import React, { useEffect } from 'react';
import { translate } from 'react-jhipster';
import './exception-page.scss';

const icon: any = {
  404: '/content/images/404.svg',
  403: '/content/images/403.svg',
};

interface IExceptionPageProps {
  type: string | number;
  description?: string;
  titleButton?: string;
  onBackTo?: () => void,
  beforeRender?: () => void,
  history?: any,
}

const ExceptionPage = (props: IExceptionPageProps) => {
  const { type, description, titleButton, onBackTo, beforeRender } = props;

  useEffect(() => {
    if (beforeRender) {
      beforeRender();
    }
  }, []);

  const handleClickButton = () => {
    if (onBackTo) {
      onBackTo();
    } else if (props.history) {
      props.history.goBack();
    }
  };

  return (
    <div className="wrap-login reset wrap-exception">
      <div className="reset-password">
        <img className="logo" src="/content/images/logo.svg" />
        <p className="title">
          {icon[type] ? <img src={icon[type]}/> : type}
        </p>
        <div className="import-email">
        <p>{description || translate('exception.404')}</p>
        </div>
        <button className="btn-login v2 button-blue" type="button" onClick={handleClickButton}>
          {titleButton || translate('exception.back')}
        </button>
      </div>
    </div>
  );
};

ExceptionPage.defaultProps = {
  type: '404',
};

export default ExceptionPage;
