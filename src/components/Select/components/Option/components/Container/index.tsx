import React, { useCallback } from 'react';

import { block } from 'utils/classname';
import { useRequiredContext } from 'utils/react/RequiredContext';

import { DependenciesContext } from './dependenciesContext';

export { DependenciesContext } from './dependenciesContext';

const b = block('select');

export type Props = {
  classname?: string;
};

function Container({ children, classname }: React.PropsWithChildren<Props>) {
  const { isActive, option, setActiveOption, setSelectIsExpanded } =
    useRequiredContext(DependenciesContext);

  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();

      setActiveOption(option);
      setSelectIsExpanded(false);
    },
    [option, setActiveOption, setSelectIsExpanded],
  );

  return (
    <div
      className={b('option', { active: isActive }, [classname])}
      onClick={handleClick}
    >
      <div className={b('option-background')} />
      {children}
    </div>
  );
}

export const DefaultComponent = React.memo(Container) as typeof Container;
