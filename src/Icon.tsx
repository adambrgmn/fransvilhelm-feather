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
  },
  baseline: {
    position: 'absolute',
    bottom: '-0.150em',
  },
};

export const Icon = forwardRef<HTMLSpanElement, IconProps>(
  ({ baseline, children }, ref) => {
    const ctx = useContext(IconContext);

    return (
      <span ref={ref} style={styles.span}>
        <svg
          {...ctx.svgProps}
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          style={{
            ...ctx.svgStyle,
            ...styles.svg,
            ...(baseline ? styles.baseline : null),
          }}
        >
          {children}
        </svg>
      </span>
    );
  },
);

type OmittedProps =
  | 'style'
  | 'className'
  | 'width'
  | 'width'
  | 'height'
  | 'viewBox';

interface TIconContext {
  svgProps: Omit<React.SVGProps<SVGSVGElement>, OmittedProps>;
  svgStyle: React.CSSProperties;
}

const defaultContext: TIconContext = {
  svgProps: {
    vectorEffect: 'non-scaling-stroke',
    'aria-hidden': true,
  },
  svgStyle: {
    fill: 'none',
    stroke: 'currentColor',
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
  },
};

const IconContext = createContext<TIconContext>(defaultContext);

export const IconProvider = IconContext.Provider;
