import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { rest } from 'msw';
import moment from 'moment';
import { setupServer } from 'msw/node';

import App from './App';

const server = setupServer(
  rest.get('https://api.github.com/search/repositories', (req, res, ctx) => {
    return res(ctx.json({ 
      items: [{
        id: 1,
        name: 'TestRepo',
        html_url: 'https://github.com/TestOwner/TestRepo',
        owner: { login: 'TestOwner' },
        pushed_at: '2020-01-01',
        stargazers_count: 1000
      }]
    }))
  }),
  rest.get('https://api.github.com/repos/TestOwner/TestRepo/commits', (req, res, ctx) => {
    return res(ctx.json([
      {
        sha: '2a2a2a2a2a2a2a2a',
        commit: {
          message: 'A test commit',
          author: { date: moment().format() }
        }
      }
    ]))
  })
)

beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

test('renders repo items after loading', async () => {
  render(<App />);
  
  await waitFor(() => screen.getByText('TestRepo'));
    
  expect(screen.getByText('TestRepo')).toBeInTheDocument();
  expect(screen.getByText('https://github.com/TestOwner/TestRepo')).toBeInTheDocument();
  expect(screen.getByText('1,000')).toBeInTheDocument();
});

test('renders commits after loading them on mouse over', async () => {
  render(<App />);
  
  await waitFor(() => screen.getByText('TestRepo'));
  
  fireEvent.mouseEnter(screen.getByText('TestRepo'));
  
  await waitFor(() => screen.getByText('A test commit'));
    
  expect(screen.getByText('A test commit')).toBeInTheDocument();
});
