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

import UserDialog from './user-dialog';
import TableNoData from '../table-no-data';
import UserTableRow from '../user-table-row';
import UserTableHead from '../user-table-head';
import UserTableToolbar from '../user-table-toolbar';

// ----------------------------------------------------------------------


export default function UserPage() {

  const rowsPerPage = 10;

  const { showAlert } = useAlert();

  const [page, setPage] = useState(0);

  const [order, setOrder] = useState('asc');

  const [orderBy, setOrderBy] = useState('username');

  const [filterName, setFilterName] = useState('');
  const [reload, setReload] = useState(false);

  //  users
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [total, setTotal] = useState(0);

  const [openDialog, setOpenDialog] = useState(false);

  const prevFilterNameRef = useRef();

  useEffect(() => {
    const prevFilterName = prevFilterNameRef.current;

    const loadUsers = async () => {
      try {
        // Load users from the backend using fetch
        const data = await fetchWrapperAxios(`/v1/users/search?keyword=${filterName}&page=${page}&orderBy=${orderBy}&order=${order}`);
        setUsers(data);
      } catch (error) {
        showAlert('Load users error', 'error');
      }
    };

    const loadTotal = async () => {
      try {
        // Load users from the backend using fetch
        const count = await fetchWrapperAxios(`/v1/users/count?keyword=${filterName}`);
        setTotal(count.total);
      } catch (error) {
        showAlert('Load total error', 'error');
      }
    };

    if (filterName !== prevFilterName) {
      setPage(0);
      loadTotal();
    }

    loadUsers();

    prevFilterNameRef.current = filterName;
  }, [filterName, page, order, orderBy, reload, showAlert, total]);


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
    setSelectedUser(row);
    setOpenDialog(true);
  }

  const closeDialog = (shouldRefetch) => {
    if (shouldRefetch) {
      setReload(!reload);
    }
    setSelectedUser(null);
    setOpenDialog(false);
  }


  return (
    <Container>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
        <Typography variant="h4">Users</Typography>
      </Stack>

      <Card>
        <UserTableToolbar
          filterName={filterName}
          onFilterName={handleFilterByName}
        />

        <Scrollbar>
          <TableContainer sx={{ overflow: 'unset' }}>
            <Table sx={{ minWidth: 800 }}>
              <UserTableHead
                order={order}
                orderBy={orderBy}
                rowCount={users.length}

                onRequestSort={handleSort}
                headLabel={[
                  { id: 'displayName', label: 'Name' },
                  { id: 'email', label: 'Email' },
                  { id: 'authType', label: 'Auth type' },
                ]}
              />
              <TableBody>
                {users
                  .map((row) => (
                    <UserTableRow
                      key={row._id}
                      displayName={row.displayName}
                      email={row.email}
                      authType={row.authType}
                      isAdmin={row.isAdmin}
                      isSuperAdmin={row.isSuperAdmin}
                      handleClick={(event) => handleClick(row)}
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
      {selectedUser && <UserDialog open={openDialog} closeDialog={closeDialog} user={selectedUser} setSelectedUser={setSelectedUser} />}
    </Container>
  );
}
