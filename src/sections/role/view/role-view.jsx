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

import TableNoData from '../table-no-data';
import RoleTableRow from '../role-table-row';
import RoleTableHead from '../role-table-head';
import RoleCreateForm from '../role-create-form';
import RoleTableToolbar from '../role-table-toolbar';

// ----------------------------------------------------------------------

export default function RoleView() {
  const rowsPerPage = 10;

  const { showAlert } = useAlert();

  const [page, setPage] = useState(0);
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('name');
  const [filterName, setFilterName] = useState('');
  const [reload, setReload] = useState(false);

  const [roles, setRoles] = useState([]);
  const [selectedRole, setSelectedRole] = useState(null);
  const [total, setTotal] = useState(0);
  const [openDialog, setOpenDialog] = useState(false);

  const prevFilterNameRef = useRef();

  useEffect(() => {
    const prevFilterName = prevFilterNameRef.current;

    const loadRoles = async () => {
      try {
        const data = await fetchWrapperAxios(`/v1/roles/search?keyword=${filterName}&page=${page}&orderBy=${orderBy}&order=${order}`);
        setRoles(data);
      } catch (error) {
        showAlert('Load roles error', 'error');
      }
    };

    const loadTotal = async () => {
      try {
        const count = await fetchWrapperAxios(`/v1/roles/count?keyword=${filterName}`);
        setTotal(count.total);
      } catch (error) {
        showAlert('Load total error', 'error');
      }
    };

    if (filterName !== prevFilterName) {
      setPage(0);
      loadTotal();
    }

    loadRoles();

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
    setSelectedRole(row);
    setOpenDialog(true);
  }

  const closeDialog = (shouldRefetch) => {
    if (shouldRefetch) {
      setReload(!reload);
    }
    setSelectedRole(null);
    setOpenDialog(false);
  }

  return (
    <Container>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
        <Typography variant="h4">Roles</Typography>
      </Stack>

      <Card>
        <RoleTableToolbar
          filterName={filterName}
          onFilterName={handleFilterByName}
        />

        <Scrollbar>
          <TableContainer sx={{ overflow: 'unset' }}>
            <Table sx={{ minWidth: 800 }}>
              <RoleTableHead
                order={order}
                orderBy={orderBy}
                rowCount={roles.length}
                onRequestSort={handleSort}
                headLabel={[
                  { id: 'name', label: 'Name' },
                  { id: 'displayName', label: 'Display Name' },
                  { id: 'description', label: 'Description' },
                  { id: 'permissions', label: 'Permissions' },
                ]}
              />
              <TableBody>
                {roles
                  .map((row) => (
                    <RoleTableRow
                      key={row._id}
                      name={row.name}
                      displayName={row.displayName}
                      description={row.description}
                      permissions={row.permissions}
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
      {selectedRole && <RoleCreateForm open={openDialog} onClose={closeDialog} role={selectedRole} />}
    </Container>
  );
}
