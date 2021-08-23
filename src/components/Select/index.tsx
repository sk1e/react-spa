import React, { useCallback, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

import { UnitRenderInterface } from 'utils/State';
import { block } from 'utils/classname';

import * as c from './components';
import './style.scss';

export { ActiveOption, Option } from './components';

const b = block('select');

type Props<T> = {
  options: T[];
  ActiveOption?: React.ComponentType<c.Option.Props<T>>;
  Option?: React.ComponentType<c.ActiveOption.Props<T>>;
  activeOptionState: UnitRenderInterface<T>;
};

function getOptionsStyle(
  rect = { left: 0, bottom: 0, width: 0 },
): React.CSSProperties {
  return {
    left: rect.left,
    top: rect.bottom + 5,
  };
}

function Select<T>(props: Props<T>) {
  const {
    options,
    activeOptionState,
    Option = c.Option.DefaultComponent,
    ActiveOption = c.ActiveOption.DefaultComponent,
  } = props;

  const [activeOption, setActiveOption] = [
    activeOptionState.useState(),
    activeOptionState.useSetState(),
  ];

  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  const ref = useRef<HTMLDivElement>(null);

  const [optionsStyle, setOptionsStyle] = useState<React.CSSProperties>();

  const handleDocumentBodyClick = useCallback((e: MouseEvent) => {
    if (!ref.current?.contains(e.target as HTMLElement)) {
      setIsExpanded(false);
      document.body.removeEventListener('click', handleDocumentBodyClick);
    }
  }, []);

  const handleActiveOptionClick = useCallback(() => {
    if (ref.current) {
      setIsExpanded(prev => !prev);
    }
  }, []);

  useLayoutEffect(
    () => () => {
      document.body.removeEventListener('click', handleDocumentBodyClick);
      document.body.style.overflow = 'auto';
    },
    [handleDocumentBodyClick],
  );

  useLayoutEffect(() => {
    document.body.style.overflow = isExpanded ? 'hidden' : 'auto';

    setOptionsStyle(getOptionsStyle(ref.current?.getBoundingClientRect()));

    if (isExpanded) {
      document.body.addEventListener('click', handleDocumentBodyClick);
    } else {
      document.body.removeEventListener('click', handleDocumentBodyClick);
    }
  }, [handleDocumentBodyClick, isExpanded]);

  const optionsRef = useRef<HTMLDivElement>(null);

  return (
    <div className={b({ expanded: isExpanded })} ref={ref}>
      <c.ActiveOption.Container.DependenciesContext.Provider
        onClick={handleActiveOptionClick}
      >
        <ActiveOption option={activeOption} />
      </c.ActiveOption.Container.DependenciesContext.Provider>
      {isExpanded &&
        createPortal(
          <div
            className={b('options', { displayed: isExpanded })}
            ref={optionsRef}
            style={optionsStyle}
          >
            {options.map((x, index) => {
              const isActive = x === activeOption;

              return (
                <c.Option.Container.DependenciesContext.Provider
                  key={index}
                  isActive={isActive}
                  option={x}
                  setActiveOption={setActiveOption}
                  setSelectIsExpanded={setIsExpanded}
                >
                  <Option<T> option={x} />
                </c.Option.Container.DependenciesContext.Provider>
              );
            })}
          </div>,
          document.body,
        )}
    </div>
  );
}

export const Component = React.memo(Select) as typeof Select;
