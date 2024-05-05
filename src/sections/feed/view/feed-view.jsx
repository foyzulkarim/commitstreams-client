import { useState } from 'react';

import Stack from '@mui/material/Stack';
import Container from '@mui/material/Container';

import { repositories } from 'src/_mock/repositories';

import ProductSort from '../sort';
import FeedCards from '../feed-cards';
import ProductFilters from '../filters';

// ----------------------------------------------------------------------

export default function ProductsView() {
  const [openFilter, setOpenFilter] = useState(false);

  const handleOpenFilter = () => {
    setOpenFilter(true);
  };

  const handleCloseFilter = () => {
    setOpenFilter(false);
  };

  return (
    <Container>

      <Stack
        direction="row"
        alignItems="center"
        flexWrap="wrap-reverse"
        justifyContent="flex-end"
        sx={{ mb: 5 }}
      >
        <Stack direction="row" spacing={1} flexShrink={0} sx={{ my: 1 }}>
          <ProductFilters
            openFilter={openFilter}
            onOpenFilter={handleOpenFilter}
            onCloseFilter={handleCloseFilter}
          />

          <ProductSort />
        </Stack>
      </Stack>

      <Stack>
        <FeedCards items={repositories} />
      </Stack>
    </Container>
  );
}
