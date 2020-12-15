import React from 'react';
import { IconProvider } from '../src/Icon';

export const parameters = {
  actions: { argTypesRegex: '^on[A-Z].*' },
  layout: 'centered',
};

export const globalTypes = {
  fontSize: {
    name: 'Font size',
    description: 'Font size to display icons in',
    toolbar: {
      icon: 'paragraph',
      items: [
        { value: '1rem', title: '1rem' },
        { value: '2rem', title: '2rem' },
        { value: '3rem', title: '3rem' },
        { value: '4rem', title: '4rem' },
        { value: '5rem', title: '5rem' },
      ],
    },
  },
  color: {
    name: 'Color',
    description: 'Color to display icons in',
    toolbar: {
      icon: 'contrast',
      items: [
        { value: '#000000', title: 'Black' },
        { value: '#ffffff', title: 'White' },
      ],
    },
  },
  strokeWidth: {
    name: 'Stroke width',
    description: 'Stroke width to display icons in',
    toolbar: {
      icon: 'circlehollow',
      items: [
        { value: '1', title: '1' },
        { value: '2', title: '2' },
        { value: '3', title: '3' },
        { value: '4', title: '4' },
        { value: '5', title: '5' },
      ],
    },
  },
};

export const decorators = [
  (Story, { globals }) => {
    return (
      <IconProvider
        value={{
          svgProps: { vectorEffect: 'non-scaling-stroke', 'aria-hidden': true },
          svgStyle: { strokeWidth: globals.strokeWidth ?? 2 },
        }}
      >
        <div
          style={{
            color: globals.color ?? '#000000',
            fontSize: globals.fontSize ?? '1rem',
          }}
        >
          <Story />
        </div>
      </IconProvider>
    );
  },
];
