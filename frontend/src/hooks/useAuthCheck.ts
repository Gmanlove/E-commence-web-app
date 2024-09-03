import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { getUserProfile } from '../slices/authSlice'; // Named import
import { AppDispatch } from '../store/store';

export const useAuthCheck = () => {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      dispatch(getUserProfile(token)); // Pass the token as an argument
    }
  }, [dispatch]);
};
