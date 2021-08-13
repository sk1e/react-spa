import React, { useCallback, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

import { RenderInterface } from 'utils/State';
import { block } from 'utils/classname';

import * as c from './components';
import './style.scss';

export { ActiveOption, Option } from './components';

const b = block('select');

type Props<T> = {
  options: T[];
  ActiveOption?: React.ComponentType<c.Option.Props<T>>;
  Option?: React.ComponentType<c.ActiveOption.Props<T>>;
  activeOptionState: RenderInterface<T>;
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

  const handleDocumentBodyClick = useCallback(() => {
    if (optionsRef.current) {
      setIsExpanded(false);
      document.body.removeEventListener('click', handleDocumentBodyClick);
    }
  }, []);

  const handleActiveOptionClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();

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
      document.body.removeEventListener('click', handleDocumentBodyClick);
    } else {
      document.body.addEventListener('click', handleDocumentBodyClick);
    }
  }, [handleDocumentBodyClick, isExpanded]);

  const optionsRef = useRef<HTMLDivElement>(null);

  return (
    <div className={b({ expanded: isExpanded })} ref={ref}>
      <c.ActiveOption.Container.DependenciesContext.Provider
        value={{ onClick: handleActiveOptionClick }}
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
                  value={{
                    isActive,
                    option: x,
                    setActiveOption,
                    setSelectIsExpanded: setIsExpanded,
                  }}
                >
                  <Option<T> key={index} option={x} />
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
