import React from 'react';
import { act, fireEvent, render, within } from '@testing-library/react-native';

import { makeJob } from 'test/fixtures';

import { useJobFiltersStore } from 'store/JobFilters/useJobFiltersStore';

jest.mock('query/Jobs/useJobs', () => ({ useJobs: jest.fn() }));
jest.mock('query/Categories/useCategories', () => ({ useCategories: jest.fn() }));

const mockPush = jest.fn();
jest.mock('expo-router', () => ({ useRouter: () => ({ push: mockPush }) }));

import { useCategories } from 'query/Categories/useCategories';
import { useJobs } from 'query/Jobs/useJobs';

import { JobList } from './JobList';

const mockUseJobs = useJobs as jest.Mock;
const mockUseCategories = useCategories as jest.Mock;

const baseResult = { data: undefined, isLoading: false, isError: false, isRefetching: false, refetch: jest.fn() };

describe('JobList', () => {
  beforeEach(async () => {
    await act(() => useJobFiltersStore.getState().reset());
    mockUseCategories.mockReturnValue({ data: [{ id: 19, name: 'Software Development', slug: 'software-dev' }] });
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('shows a loading indicator in the list body while the query is loading', async () => {
    mockUseJobs.mockReturnValue({ ...baseResult, isLoading: true });
    const { getByTestId, getByText, queryByText } = await render(<JobList />);
    expect(getByTestId('jobs-loading-indicator')).toBeTruthy();
    // The list (and its header) stays mounted — only the body shows the spinner.
    expect(getByText('Job Listings')).toBeTruthy();
    expect(queryByText('No jobs found')).toBeNull();
  });

  it('shows an error state that can retry via pull-to-refresh', async () => {
    const refetch = jest.fn();
    mockUseJobs.mockReturnValue({ ...baseResult, isError: true, refetch });
    const { getByText, getByTestId } = await render(<JobList />);
    expect(getByText('Something went wrong')).toBeTruthy();

    await fireEvent(getByTestId('jobs-list'), 'refresh');
    expect(refetch).toHaveBeenCalled();
  });

  it('replaces the cached list with the error state when a refetch fails', async () => {
    const job = makeJob({ title: 'Senior Backend Engineer' });
    mockUseJobs.mockReturnValue({
      ...baseResult,
      isError: true,
      data: { jobCount: 1, totalJobCount: 1, jobs: [job] },
    });

    const { getByText, queryByText } = await render(<JobList />);
    expect(getByText('Something went wrong')).toBeTruthy();
    expect(queryByText('Senior Backend Engineer')).toBeNull();
  });

  it('shows the empty state when there are no jobs', async () => {
    mockUseJobs.mockReturnValue({ ...baseResult, data: { jobCount: 0, totalJobCount: 0, jobs: [] } });
    const { getByText } = await render(<JobList />);
    expect(getByText('No jobs found')).toBeTruthy();
  });

  it('renders a job card per job', async () => {
    const job = makeJob({ title: 'Senior Backend Engineer' });
    mockUseJobs.mockReturnValue({ ...baseResult, data: { jobCount: 1, totalJobCount: 1, jobs: [job] } });
    const { getByText } = await render(<JobList />);
    expect(getByText('Senior Backend Engineer')).toBeTruthy();
  });

  it('opens the filters modal from the Filters button', async () => {
    mockUseJobs.mockReturnValue({ ...baseResult, data: { jobCount: 0, totalJobCount: 0, jobs: [] } });
    const { getByLabelText, queryByPlaceholderText } = await render(<JobList />);

    expect(queryByPlaceholderText('Search by title or company')).toBeNull();
    await fireEvent.press(getByLabelText('Filters'));
    expect(queryByPlaceholderText('Search by title or company')).toBeTruthy();
  });

  it('closes the filters modal from its close button', async () => {
    mockUseJobs.mockReturnValue({ ...baseResult, data: { jobCount: 0, totalJobCount: 0, jobs: [] } });
    const { getByLabelText, queryByPlaceholderText } = await render(<JobList />);

    await fireEvent.press(getByLabelText('Filters'));
    await fireEvent.press(getByLabelText('Close filters'));

    expect(queryByPlaceholderText('Search by title or company')).toBeNull();
  });

  it('filters the rendered jobs by search text typed in the modal', async () => {
    const backend = makeJob({ title: 'Senior Backend Engineer', companyName: 'Acme' });
    const designer = makeJob({ title: 'Product Designer', companyName: 'Globex' });
    mockUseJobs.mockReturnValue({
      ...baseResult,
      data: { jobCount: 2, totalJobCount: 2, jobs: [backend, designer] },
    });

    jest.useFakeTimers();
    const { getByText, getByLabelText, queryByText, getByPlaceholderText } = await render(<JobList />);
    expect(getByText('Senior Backend Engineer')).toBeTruthy();
    expect(getByText('Product Designer')).toBeTruthy();

    await fireEvent.press(getByLabelText('Filters'));
    await fireEvent.changeText(getByPlaceholderText('Search by title or company'), 'backend');
    await act(() => jest.advanceTimersByTime(200));

    expect(getByText('Senior Backend Engineer')).toBeTruthy();
    expect(queryByText('Product Designer')).toBeNull();
  });

  it('shows the filtered empty state when filters exclude every job', async () => {
    const job = makeJob({ title: 'Senior Backend Engineer' });
    mockUseJobs.mockReturnValue({ ...baseResult, data: { jobCount: 1, totalJobCount: 1, jobs: [job] } });

    jest.useFakeTimers();
    const { getByText, getByLabelText, queryByText, getByPlaceholderText } = await render(<JobList />);
    await fireEvent.press(getByLabelText('Filters'));
    await fireEvent.changeText(getByPlaceholderText('Search by title or company'), 'nonexistent role');
    await act(() => jest.advanceTimersByTime(200));

    expect(getByText('No matching jobs')).toBeTruthy();
    expect(queryByText('No jobs found')).toBeNull();
  });

  it('filters the rendered jobs by category selection', async () => {
    const softwareJob = makeJob({ title: 'Backend Engineer', category: 'Software Development' });
    const designJob = makeJob({ title: 'Product Designer', category: 'Design' });
    mockUseJobs.mockReturnValue({
      ...baseResult,
      data: { jobCount: 2, totalJobCount: 2, jobs: [softwareJob, designJob] },
    });

    // Scoped to the modal sheet: the job card behind it is also a button whose
    // subtree contains the category text, so an unscoped role query is ambiguous.
    const { getByText, getByLabelText, getByTestId, queryByText } = await render(<JobList />);
    await fireEvent.press(getByLabelText('Filters'));
    await fireEvent.press(getByTestId('category-dropdown'));
    const sheet = within(getByTestId('filters-modal-sheet'));
    await fireEvent.press(sheet.getByRole('button', { name: /^Software Development$/ }));

    expect(getByText('Backend Engineer')).toBeTruthy();
    expect(queryByText('Product Designer')).toBeNull();
  });

  it('filters the rendered jobs by one or more selected job types', async () => {
    const contractJob = makeJob({ title: 'Contract Engineer', jobType: 'contract' });
    const fullTimeJob = makeJob({ title: 'Staff Engineer', jobType: 'full_time' });
    mockUseJobs.mockReturnValue({
      ...baseResult,
      data: { jobCount: 2, totalJobCount: 2, jobs: [contractJob, fullTimeJob] },
    });

    const { getByText, getByTestId, getByLabelText, queryByText } = await render(<JobList />);
    await fireEvent.press(getByLabelText('Filters'));
    const sheet = within(getByTestId('filters-modal-sheet'));
    await fireEvent.press(sheet.getByRole('button', { name: /^Contract$/ }));

    expect(getByText('Contract Engineer')).toBeTruthy();
    expect(queryByText('Staff Engineer')).toBeNull();
  });

  it('shows a badge with the active filter count on the Filters button', async () => {
    const contractJob = makeJob({ jobType: 'contract' });
    mockUseJobs.mockReturnValue({ ...baseResult, data: { jobCount: 1, totalJobCount: 1, jobs: [contractJob] } });

    const { getByText, getByTestId, getByLabelText, queryByText } = await render(<JobList />);
    expect(queryByText('1')).toBeNull();

    await fireEvent.press(getByLabelText('Filters'));
    const sheet = within(getByTestId('filters-modal-sheet'));
    await fireEvent.press(sheet.getByRole('button', { name: /^Contract$/ }));
    await fireEvent.press(getByLabelText('Close filters'));

    expect(getByText('1')).toBeTruthy();
  });

  it('shows a live result count on the done button and closes the modal from it', async () => {
    const backend = makeJob({ title: 'Senior Backend Engineer' });
    const designer = makeJob({ title: 'Product Designer' });
    mockUseJobs.mockReturnValue({
      ...baseResult,
      data: { jobCount: 2, totalJobCount: 2, jobs: [backend, designer] },
    });

    jest.useFakeTimers();
    const { getByText, getByLabelText, getByPlaceholderText, queryByPlaceholderText } = await render(<JobList />);
    await fireEvent.press(getByLabelText('Filters'));
    expect(getByText('Show 2 jobs')).toBeTruthy();

    await fireEvent.changeText(getByPlaceholderText('Search by title or company'), 'backend');
    await act(() => jest.advanceTimersByTime(200));
    expect(getByText('Show 1 job')).toBeTruthy();

    await fireEvent.press(getByText('Show 1 job'));
    expect(queryByPlaceholderText('Search by title or company')).toBeNull();
  });
});
