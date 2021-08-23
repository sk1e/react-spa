import { Button } from 'components';
import { Language } from 'features/global';
import { useForm } from 'utils/FormState';
import { block } from 'utils/classname';
import { withContextProviders } from 'utils/react/withContextProviders';

import * as c from './components';
import './style.scss';

const b = block('register-form');

type Props = {};

function RegisterForm({}: Props) {
  const form = useForm({
    firstName: c.FirstNameInput.formElementState,
    secondName: c.SecondNameInput.formElementState,
    password: c.PasswordInput.formElementState,
  });

  const handleSubmit = form.makeSubmitHandler(data => {
    console.log('>> submit', data);
  });

  const submitButtonLabel = Language.useTranslation({
    en: 'Submit',
    ru: 'Создать',
  });

  return (
    <form className={b()} onSubmit={handleSubmit}>
      <c.FirstNameInput.Component />
      <c.SecondNameInput.Component />
      <c.PasswordInput.Component />
      <Button.Component className={b('submit-button')} type="submit">
        {submitButtonLabel}
      </Button.Component>
    </form>
  );
}

export const Component = withContextProviders(RegisterForm, [
  c.FirstNameInput.formElementState.ContextProvider,
  c.SecondNameInput.formElementState.ContextProvider,
  c.PasswordInput.formElementState.ContextProvider,
]);
