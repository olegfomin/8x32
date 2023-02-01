import { render, screen } from '@testing-library/react';
import Court from './Court';

test('renders learn react link', () => {
  render(<Court />);
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});
