import React from 'react';

import { Text } from 'components';
import { Language } from 'features/global';
import { GenericWidget } from 'types';
import { block, classnames } from 'utils/classname';

import './style.scss';

const b = block('widget-layout');

type Props = {
  className?: string;
  widget: GenericWidget<string, any>;
};

function WidgetLayout({
  className,
  children,
  widget,
}: React.PropsWithChildren<Props>) {
  const t = Language.useGetMultilingTranslation();

  return (
    <div className={classnames(b(), className)}>
      <Text.Component typography="heading-m" as="h2">
        {t(widget.title)}
      </Text.Component>
      {children}
    </div>
  );
}

export const Component = React.memo(WidgetLayout) as typeof WidgetLayout;
