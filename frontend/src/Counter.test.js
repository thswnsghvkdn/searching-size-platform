import { render } from '@testing-library/react';

import Counter from './Counter';

describe('Counter test', () => {
  it('should render Counter', () => {
    render(<Counter />);
  });
});