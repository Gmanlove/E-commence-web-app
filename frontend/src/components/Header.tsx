import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/store';
import { logout } from '../slices/authSlice';

const Header: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userInfo } = useSelector((state: RootState) => state.auth); // Get user info from Redux store

  const handleLogout = () => {
    dispatch(logout()); // Dispatch the logout action to clear user info
    navigate('/'); // Navigate to the home page after logout
  };

  useEffect(() => {
    console.log('User Info:', userInfo); // Debug: Log userInfo to verify if it updates
  }, [userInfo]); // Re-run when userInfo changes

  return (
    <header className="bg-blue-600 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-xl font-bold">E-Commerce App</Link>
        <nav>
          {userInfo ? (
            <>
              <Link to="/profile" className="mr-4">Profile</Link>
              <button onClick={handleLogout} className="bg-red-500 text-white px-4 py-2">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="mr-4">Login</Link>
              <Link to="/register" className="bg-green-500 text-white px-4 py-2">
                Register
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
