import React from 'react';
import { renderToString } from 'react-dom/server';
import { MemoryRouter } from 'react-router-dom';
import Home from './src/pages/Home.tsx';

try {
  const html = renderToString(
    <MemoryRouter initialEntries={["/"]}>
      <Home />
    </MemoryRouter>
  );
  console.log('--- HTML OUTPUT START ---');
  console.log(html.substring(0, 1000));
  console.log('--- HTML OUTPUT END ---');
} catch (error) {
  console.error('--- RENDER ERROR ---');
  console.error(error);
}
