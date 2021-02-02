import React, { forwardRef, createContext, useContext } from 'react';

export interface IconProps {
  baseline?: boolean;
}

const styles: Record<'span' | 'svg' | 'baseline', React.CSSProperties> = {
  span: {
    position: 'relative',
    display: 'inline-flex',
    alignSelf: 'center',
    width: '1em',
    height: '1em',
  },
  svg: {
    width: '1em',
    height: '1em',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 2,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
  },
  baseline: {
    position: 'absolute',
    bottom: '-0.150em',
  },
};

export const Icon = forwardRef<
  HTMLSpanElement,
  IconProps & { children: React.ReactNode }
>(({ baseline, children }, ref) => {
  const ctx = useContext(IconContext);

  return (
    <span ref={ref} style={styles.span}>
      <svg
        aria-hidden
        focusable={false}
        {...ctx.svgProps}
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        style={{
          ...styles.svg,
          ...(baseline ? styles.baseline : null),
          ...ctx.svgStyle,
        }}
      >
        {children}
      </svg>
    </span>
  );
});

type OmittedProps =
  | 'style'
  | 'className'
  | 'width'
  | 'width'
  | 'height'
  | 'viewBox'
  | 'xmlns';

interface TIconContext {
  svgProps: Omit<React.SVGProps<SVGSVGElement>, OmittedProps>;
  svgStyle: React.CSSProperties;
}

const defaultContext: TIconContext = {
  svgProps: {
    vectorEffect: 'non-scaling-stroke',
    'aria-hidden': true,
  },
  svgStyle: {},
};

const IconContext = createContext<TIconContext>(defaultContext);

export const IconProvider = IconContext.Provider;
