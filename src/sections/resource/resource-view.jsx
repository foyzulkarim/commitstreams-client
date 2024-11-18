import { useRef, useState, useEffect } from 'react';

import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import Container from '@mui/material/Container';
import TableBody from '@mui/material/TableBody';
import Typography from '@mui/material/Typography';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';

import { fetchWrapperAxios } from 'src/utils/api';

import { useAlert } from 'src/contexts/AlertContext';

import Scrollbar from 'src/components/scrollbar';

import TableNoData from './table-no-data';
import ResourceTableRow from './resource-table-row';
import ResourceTableHead from './resource-table-head';
import ResourceCreateForm from './resource-create-form';
import ResourceTableToolbar from './resource-table-toolbar';
// ----------------------------------------------------------------------
export default function ResourceView() {
  const rowsPerPage = 10;
  const { showAlert } = useAlert();
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('name');
  const [filterName, setFilterName] = useState('');
  const [reload, setReload] = useState(false);
  const [resources, setResources] = useState([]);
  const [selectedResource, setSelectedResource] = useState(null);
  const [total, setTotal] = useState(0);
  const [openDialog, setOpenDialog] = useState(false);
  const prevFilterNameRef = useRef();
  useEffect(() => {
    const prevFilterName = prevFilterNameRef.current;
    const loadResources = async () => {
      try {
        const data = await fetchWrapperAxios(
          `/v1/resources/search?keyword=${filterName}&page=${page}&orderBy=${orderBy}&order=${order}`
        );
        setResources(data);
      } catch (error) {
        showAlert('Load resources error', 'error');
      }
    };
    const loadTotal = async () => {
      try {
        const count = await fetchWrapperAxios(`/v1/resources/count?keyword=${filterName}`);
        setTotal(count.total);
      } catch (error) {
        showAlert('Load total error', 'error');
      }
    };
    if (filterName !== prevFilterName) {
      setPage(0);
      loadTotal();
    }
    loadResources();
    prevFilterNameRef.current = filterName;
  }, [filterName, page, order, orderBy, reload, showAlert]);
  const handleSort = (event, id) => {
    const isAsc = orderBy === id && order === 'asc';
    if (id !== '') {
      setOrder(isAsc ? 'desc' : 'asc');
      setOrderBy(id);
    }
  };
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  const handleFilterByName = (event) => {
    setFilterName(event.target.value);
  };
  const handleClick = async (row) => {
    setSelectedResource(row);
    setOpenDialog(true);
  };
  const closeDialog = (shouldRefetch) => {
    if (shouldRefetch) {
      setReload(!reload);
    }
    setSelectedResource(null);
    setOpenDialog(false);
  };
  return (
    <Container>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
        <Typography variant="h4">Resources</Typography>
      </Stack>
      <Card>
        <ResourceTableToolbar filterName={filterName} onFilterName={handleFilterByName} />
        <Scrollbar>
          <TableContainer sx={{ overflow: 'unset' }}>
            <Table sx={{ minWidth: 800 }}>
              <ResourceTableHead
                order={order}
                orderBy={orderBy}
                rowCount={resources.length}
                onRequestSort={handleSort}
                headLabel={[
                  { id: 'name', label: 'Name' },
                  { id: 'description', label: 'Description' },
                ]}
              />
              <TableBody>
                {resources.map((row) => (
                  <ResourceTableRow
                    key={row._id}
                    name={row.name}
                    description={row.description}
                    handleClick={() => handleClick(row)}
                    searchTerm={filterName}
                  />
                ))}
                {!total && <TableNoData query={filterName} />}
              </TableBody>
            </Table>
          </TableContainer>
        </Scrollbar>
        <TablePagination
          page={page}
          component="div"
          count={total}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          rowsPerPageOptions={[]}
        />
      </Card>
      {selectedResource && (
        <ResourceCreateForm open={openDialog} onClose={closeDialog} resource={selectedResource} />
      )}
    </Container>
  );
}
