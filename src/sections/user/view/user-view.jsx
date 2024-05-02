import { useRef, useState, useEffect } from 'react';

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
import UserTableToolbar from '../user-table-toolbar';

// ----------------------------------------------------------------------


export default function UserPage() {

  const rowsPerPage = 10;

  const fetchWrapper = async (url) => {
    try {
      const response = await fetch(url, {
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error(`Fetch failed: ${error}`);
      throw error;
    }
  };


  const [page, setPage] = useState(0);

  const [order, setOrder] = useState('asc');

  const [orderBy, setOrderBy] = useState('username');

  const [filterName, setFilterName] = useState('');

  //  users
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [total, setTotal] = useState(0);

  const [openDialog, setOpenDialog] = useState(false);

  const prevFilterNameRef = useRef();

  useEffect(() => {
    const apiUrl = import.meta.env.VITE_API_URL;
    const prevFilterName = prevFilterNameRef.current;

    console.log('page', page);

    const loadUsers = async () => {
      try {
        // Load users from the backend using fetch
        const data = await fetchWrapper(`${apiUrl}/v1/users/search?keyword=${filterName}&page=${page}&orderBy=${orderBy}&order=${order}`);
        setUsers(data);
      } catch (error) {
        console.error('Load users error:', error);
      }
    };

    const loadTotal = async () => {
      try {
        // Load users from the backend using fetch
        const count = await fetchWrapper(`${apiUrl}/v1/users/count?keyword=${filterName}`);
        setTotal(count.total);
      } catch (error) {
        console.error('Load total error:', error);
      }
    };

    if (filterName !== prevFilterName) {
      setPage(0);
      loadTotal();
    }

    loadUsers();

    prevFilterNameRef.current = filterName;

  }, [filterName, page, order, orderBy]);


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
    // setPage(0);
    console.log('handleFilterByName', event.target.value);
    setFilterName(event.target.value);
  };

  const handleClick = async (row) => {
    console.log('handleClick', row);
    setSelectedUser(row);
    setOpenDialog(true);
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
                  { id: 'username', label: 'Username' },
                  { id: 'displayName', label: 'Name' },
                  { id: 'created_at', label: 'GitHub profile created' },
                  { id: 'location', label: 'Location' },
                  { id: 'public_repos', label: 'Public repos', },
                ]}
              />
              <TableBody>
                {users
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
      {selectedUser && <UserDialog open={openDialog} setOpen={setOpenDialog} user={selectedUser} setSelectedUser={setSelectedUser} />}
    </Container>
  );
}
