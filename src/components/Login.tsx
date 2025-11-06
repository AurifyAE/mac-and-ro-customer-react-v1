import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Logo from '../assets/Logo/OrovivoLogo.svg';
import eye from './icons/eye.svg'
import eyeClosed from './icons/eye closed.svg'

const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const { login, isLoading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!username || !password) {
      setError('Please fill in all fields');
      return;
    }

    const success = await login(username, password);
    if (success) {
      navigate('/');
    } else {
      setError('Invalid username or password');
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left side - Dark background - Hidden on mobile */}
      <div className="hidden md:flex md:flex-1 bg-gray-800"></div>
      
      {/* Right side - Login form */}
      <div className="flex-1 flex items-center justify-center px-4 py-8 md:px-0">
        <div className="max-w-md w-full">
          {/* Logo */}
          <div className="text-center mb-6 md:mb-8">
            <img src={Logo} alt="Orovivo Logo" className="mx-auto h-20 md:h-30 w-auto" />
          </div>

          {/* Welcome text */}
          <div className="text-center mb-6 md:mb-8">
            <h2 className="text-xl md:text-2xl font-semibold text-gray-800 mb-2">Welcome Back</h2>
            <p className="text-sm md:text-base text-gray-600">Login to continue your gold investments</p>
          </div>

          {/* Login form */}
          <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
                Username *
              </label>
              <input
                id="username"
                name="username"
                type="text"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none transition-colors"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password *
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg outline-none transition-colors"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                 
                    {showPassword ? (
                      <img src={eyeClosed} alt="" />
                    ) : (
                      <img src={eye} alt="" />
                    )}
                </button>
              </div>
            </div>

            {error && (
              <div className="text-red-600 text-sm text-center bg-red-50 p-3 rounded-lg">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#242627] hover:bg-gray-900 text-white font-medium py-3 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm md:text-base"
            >
              {isLoading ? 'Signing in...' : 'Login'}
            </button>
          </form>

          {/* Register link */}
          <div className="text-center mt-4 md:mt-6">
            <span className="text-sm md:text-base text-gray-600">New here? </span>
            <Link
              to="/register"
              className="text-sm md:text-base text-gray-800 hover:text-gray-900 font-medium hover:underline"
            >
              Register
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
