import React from 'react';
import { fireEvent, render } from '@testing-library/react-native';

jest.mock('expo-web-browser', () => ({ openBrowserAsync: jest.fn() }));

import * as WebBrowser from 'expo-web-browser';

import { JobDescription } from './JobDescription';

const mockOpenBrowser = WebBrowser.openBrowserAsync as jest.Mock;

describe('JobDescription', () => {
  it('renders paragraphs, emphasis, and list items as native text', async () => {
    const html =
      '<p>We are <strong>hiring</strong></p><ul><li>Ship features</li><li>Review code</li></ul>';

    const { getByText } = await render(<JobDescription html={html} />);

    expect(getByText(/We are/)).toBeTruthy();
    expect(getByText('hiring')).toBeTruthy();
    expect(getByText('Ship features')).toBeTruthy();
    expect(getByText('Review code')).toBeTruthy();
  });

  it('opens links in the in-app browser', async () => {
    const html = '<p><a href="https://acme.com/apply">Apply here</a></p>';

    const { getByText } = await render(<JobDescription html={html} />);
    await fireEvent.press(getByText('Apply here'));

    expect(mockOpenBrowser).toHaveBeenCalledWith('https://acme.com/apply');
  });

  it('does not render blank filler paragraphs', async () => {
    const html = '<p>Real content</p><p>&nbsp;</p>';

    const { getByText, queryByText } = await render(<JobDescription html={html} />);

    expect(getByText('Real content')).toBeTruthy();
    expect(queryByText('\u00A0')).toBeNull();
  });
});
