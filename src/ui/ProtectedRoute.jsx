import { useNavigate } from 'react-router-dom';
import { useUser } from '../features/authentication/useUser';
import Spinner from './Spinner';
import toast from 'react-hot-toast';
import styled from 'styled-components';
import Heading from './Heading';
import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';

//create a quick full page layout
const FullPage = styled.div`
  height: 100vh;
  width: 100svw;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: var(--color-grey-100);
`;

function ProtectedRoute({ children }) {
  //This is to make the site inaccessible to non-authorised users
  //step 1 - load the authenticated user
  const { isCheckingUser, isAuthenticated } = useUser();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  //step 2 - if no authenticated user redirect
  useEffect(() => {
    //console.log(`Protected route checking user...`);
    if (!isAuthenticated && !isCheckingUser) {
      //just in case the staleTime in react query is not zero
      queryClient.clear();
      toast.error(`You are not logged in as an authorised user`);
      navigate('../login');
    }
  }, [isAuthenticated, isCheckingUser, navigate, queryClient]);

  //everything has gone well and we are an authenticated user
  if (isAuthenticated) return children;

  //we are still checking but have not been redirected
  return (
    <FullPage>
      <Heading as="h2">Checking User</Heading>
      <Spinner />
    </FullPage>
  );
}

export default ProtectedRoute;
