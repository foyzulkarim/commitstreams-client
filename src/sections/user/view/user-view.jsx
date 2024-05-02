import { useState, useEffect } from 'react';

import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import Container from '@mui/material/Container';
import TableBody from '@mui/material/TableBody';
import Typography from '@mui/material/Typography';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';

import Scrollbar from 'src/components/scrollbar';

import UserDialog from './user-dialog';
import TableNoData from '../table-no-data';
import UserTableRow from '../user-table-row';
import UserTableHead from '../user-table-head';
import TableEmptyRows from '../table-empty-rows';
import UserTableToolbar from '../user-table-toolbar';
import { emptyRows, applyFilter, getComparator } from '../utils';

// ----------------------------------------------------------------------

export default function UserPage() {

  const [page, setPage] = useState(0);

  const [order, setOrder] = useState('asc');

  const [orderBy, setOrderBy] = useState('name');

  const [filterName, setFilterName] = useState('');

  const [rowsPerPage, setRowsPerPage] = useState(5);

  //  users
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);

  const [openDialog, setOpenDialog] = useState(false);

  useEffect(() => {
    const apiUrl = import.meta.env.VITE_API_URL;
    const loadUsers = async () => {
      try {
        // Load users from the backend using fetch
        const response = await fetch(`${apiUrl}/v1/users`, {
          credentials: 'include'  // Crucial setting 
        });

        if (!response.ok) {
          // throw new Error('Users fetch failed');
          console.error('Users fetch failed', response);
        } else {
          const data = await response.json();
          console.log('Users:', { data });
          setUsers(data)
        }


      } catch (error) {
        console.error('Load users error:', error);
      }
    };

    loadUsers();
  }, []);

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

  const handleChangeRowsPerPage = (event) => {
    setPage(0);
    setRowsPerPage(parseInt(event.target.value, 10));
  };

  const handleFilterByName = (event) => {
    // setPage(0);
    setFilterName(event.target.value);
    console.log('handleFilterByName', event.target.value);
  };

  const handleClick = async (row) => {
    console.log('handleClick', row);
    setSelectedUser(row);
    setOpenDialog(true);
  }

  const dataFiltered = applyFilter({
    inputData: users,
    comparator: getComparator(order, orderBy),
    filterName,
  });

  const notFound = !dataFiltered.length && !!filterName;

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
                  { id: 'username', label: 'Username' },
                  { id: 'displayName', label: 'Name' },
                  { id: 'created_at', label: 'GitHub profile created' },
                  { id: 'location', label: 'Location' },
                  { id: 'public_repos', label: 'Public repos', },
                ]}
              />
              <TableBody>
                {dataFiltered
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row) => (
                    <UserTableRow
                      key={row._id}
                      username={row.username}
                      displayName={row.displayName}
                      location={row.location}
                      created_at={row.created_at}
                      avatarUrl={row.avatarUrl}
                      public_repos={row.public_repos}
                      handleClick={(event) => handleClick(row)}
                    />
                  ))}

                <TableEmptyRows
                  height={77}
                  emptyRows={emptyRows(page, rowsPerPage, users.length)}
                />

                {notFound && <TableNoData query={filterName} />}
              </TableBody>
            </Table>
          </TableContainer>
        </Scrollbar>

        <TablePagination
          page={page}
          component="div"
          count={users.length}
          rowsPerPage={rowsPerPage}
          onPageChange={handleChangePage}
          rowsPerPageOptions={[5, 10, 25]}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Card>
      {selectedUser && <UserDialog open={openDialog} setOpen={setOpenDialog} user={selectedUser} setSelectedUser={setSelectedUser} />}
    </Container>
  );
}
