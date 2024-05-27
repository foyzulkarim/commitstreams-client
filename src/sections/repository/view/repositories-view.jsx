import { useRef, useState, useEffect, useContext } from 'react';

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
import { AuthContext } from 'src/contexts/AuthContext';

import Scrollbar from 'src/components/scrollbar';

import TableNoData from '../table-no-data';
import RepositoryTableRow from '../user-table-row';
import RepositoryTableHead from '../user-table-head';
import RepositoryTableToolbar from '../user-table-toolbar';

// ----------------------------------------------------------------------


export default function RepositoryPage() {

  const { userProfile } = useContext(AuthContext);
  const { showAlert } = useAlert();

  const rowsPerPage = 10;

  const [page, setPage] = useState(0);

  const [order, setOrder] = useState('asc');

  const [orderBy, setOrderBy] = useState('full_name');

  const [filterName, setFilterName] = useState('');
  // const [reload, setReload] = useState(false);

  //  repositories
  const [repositories, setRepositories] = useState([]);
  // const [selectedRepository, setSelectedRepository] = useState(null);
  const [total, setTotal] = useState(0);

  // const [openDialog, setOpenDialog] = useState(false);

  const prevFilterNameRef = useRef();

  useEffect(() => {
    const prevFilterName = prevFilterNameRef.current;
    const loadRepositorys = async () => {
      try {
        // Load repositories from the backend using fetch
        const data = await fetchWrapperAxios(`/v1/repositories/search?keyword=${filterName}&page=${page}&orderBy=${orderBy}&order=${order}`);
        const processedData = data.map(repo => {
          const isFollowing = repo.csFollowers?.some(follower => follower._id === userProfile._id)
          repo.isFollowing = isFollowing;
          return repo;
        });
        setRepositories(processedData);
      } catch (error) {
        showAlert('Load repositories error', 'error');
      }
    };

    const loadTotal = async () => {
      try {
        // Load repositories from the backend using fetch
        const count = await fetchWrapperAxios(`/v1/repositories/count?keyword=${filterName}`);
        setTotal(count.total);
      } catch (error) {
        showAlert('Load total error', 'error');
      }
    };

    if (filterName !== prevFilterName) {
      setPage(0);
      loadTotal();
    }

    loadRepositorys();

    prevFilterNameRef.current = filterName;

  }, [filterName, page, order, orderBy, userProfile._id, showAlert]); // add reload


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


  return (
    <Container>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
        <Typography variant="h4">Repositories</Typography>
      </Stack>

      <Card>
        <RepositoryTableToolbar
          filterName={filterName}
          onFilterName={handleFilterByName}
        />

        <Scrollbar>
          <TableContainer sx={{ overflow: 'unset' }}>
            <Table sx={{ minWidth: 800 }}>
              <RepositoryTableHead
                order={order}
                orderBy={orderBy}
                rowCount={repositories.length}

                onRequestSort={handleSort}
                headLabel={[
                  { id: 'full_name', label: 'Repository name' },
                  { id: 'language', label: 'Language' },
                  { id: 'created_at', label: 'Created' },
                  { id: 'forks_count', label: 'Forks' },
                  { id: 'stargazers_count', label: 'Stars' },
                  { id: 'isFollowing', label: 'Following', disableSort: true },
                ]}
              />
              <TableBody>
                {repositories
                  .map((row) => (
                    <RepositoryTableRow
                      key={row._id}
                      // handleClick={(event) => handleClick(row)}
                      searchTerm={filterName}
                      avatarUrl={row.owner.avatar_url}
                      isFollowing={row.isFollowing}
                      {...row}
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

    </Container>
  );
}
