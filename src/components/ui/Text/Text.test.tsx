import React from 'react';
import { render } from '@testing-library/react-native';

import { Text } from './Text';

describe('Text', () => {
  it('renders its children', async () => {
    const { getByText } = await render(<Text>Hello World</Text>);
    expect(getByText('Hello World')).toBeTruthy();
  });

  it('applies the color, size, and weight tokens', async () => {
    const { getByText } = await render(
      <Text color="font-brand" size="font-size-xl" weight="font-weight-bold">
        Open positions
      </Text>,
    );
    const node = getByText('Open positions');
    const flatStyle = Array.isArray(node.props.style) ? Object.assign({}, ...node.props.style) : node.props.style;
    expect(flatStyle).toMatchObject({ fontSize: 22, fontWeight: '700' });
  });
});
