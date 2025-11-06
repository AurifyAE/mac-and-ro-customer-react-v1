import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Logo from '../assets/Logo/OrovivoLogo.svg';
import coustomer from './icons/customer.svg';
import customerActive from './icons/customeractive.svg';
import company from './icons/company.svg';
import companyActive from './icons/companyactive.svg';

const Register: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [accountType, setAccountType] = useState<'B2C' | 'B2B' | null>('B2C');
  const [formData, setFormData] = useState({
    fullName: '',
    companyName: '',
    username: '',
    email: '',
    phoneNumber: '',
    password: '',
    confirmPassword: ''
  });
  const [profilePicture, setProfilePicture] = useState<File | null>(null);
  const [profilePicturePreview, setProfilePicturePreview] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const { register, isLoading } = useAuth();
  const navigate = useNavigate();

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleNextStep = () => {
    if (currentStep === 1) {
      if (!accountType) {
        setError('Please select an account type');
        return;
      }
      
      const requiredFields = accountType === 'B2C' 
        ? ['fullName', 'username', 'email', 'phoneNumber']
        : ['companyName', 'username', 'email', 'phoneNumber'];
      
      const missingFields = requiredFields.filter(field => !formData[field as keyof typeof formData]);
      if (missingFields.length > 0) {
        setError('Please fill in all required fields');
        return;
      }
    }
    if (currentStep === 2) {
      if (!formData.password || !formData.confirmPassword) {
        setError('Please fill in both password fields');
        return;
      }
      if (formData.password !== formData.confirmPassword) {
        setError('Passwords do not match');
        return;
      }
      if (formData.password.length < 6) {
        setError('Password must be at least 6 characters long');
        return;
      }
    }
    
    setError('');
    setCurrentStep(prev => prev + 1);
  };

  const handlePrevStep = () => {
    setCurrentStep(prev => prev - 1);
    setError('');
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfilePicture(file);
      const reader = new FileReader();
      reader.onload = () => {
        setProfilePicturePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFinalSubmit = async () => {
    const success = await register(formData.fullName, formData.email, formData.password);
    if (success) {
      navigate('/');
    } else {
      setError('Registration failed. Please try again.');
    }
  };

  const renderStep1 = () => (
    <div className="max-w-md w-full">
      {/* Logo */}
      <div className="text-center mb-6 md:mb-8">
        <img src={Logo} alt="Orovivo Logo" className="mx-auto h-20 md:h-30 w-auto" />
      </div>

      {/* Welcome text */}
      <div className="text-center mb-6 md:mb-8">
        <h2 className="text-xl md:text-2xl font-semibold text-gray-800 mb-2">Create Your Account</h2>
        <p className="text-sm md:text-base text-gray-600">Start your journey to gold investment</p>
      </div>

      {/* Account type selection */}
      <div className="space-y-4 mb-4 md:mb-6">
        <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
          <button
            type="button"
            onClick={() => setAccountType('B2C')}
            className={`flex-1 py-3 px-4 rounded-lg border transition-colors ${
              accountType === 'B2C' 
                ? 'border-gray-800 bg-white text-gray-800' 
                : 'border-gray-300 bg-gray-100 text-gray-500 hover:border-gray-400'
            }`}
          >
            <div className="flex items-center justify-center space-x-2">
              <img src={accountType === 'B2C' ? customerActive : coustomer} alt="" className="w-5 h-5" />
              <span className="font-medium text-sm md:text-base">B2C</span>
            </div>
          </button>
          <button
            type="button"
            onClick={() => setAccountType('B2B')}
            className={`flex-1 py-3 px-4 rounded-lg border transition-colors ${
              accountType === 'B2B' 
                ? 'border-gray-800 bg-white text-gray-800' 
                : 'border-gray-300 bg-gray-100 text-gray-500 hover:border-gray-400'
            }`}
          >
            <div className="flex items-center justify-center space-x-2">
              <img src={accountType === 'B2B' ? companyActive : company} alt="" className="w-5 h-5" />
              <span className="font-medium text-sm md:text-base">B2B</span>
            </div>
          </button>
        </div>
      </div>

      {/* Form fields */}
      <div className="space-y-3 md:space-y-4 mb-4 md:mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {accountType === 'B2B' ? 'Company Name *' : 'Full Name *'}
          </label>
          <input
            type="text"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none transition-colors"
            placeholder={accountType === 'B2B' ? 'Enter your company name' : 'Enter your full name'}
            value={accountType === 'B2B' ? formData.companyName : formData.fullName}
            onChange={(e) => handleInputChange(accountType === 'B2B' ? 'companyName' : 'fullName', e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Username *
          </label>
          <input
            type="text"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none transition-colors"
            placeholder="Enter your username"
            value={formData.username}
            onChange={(e) => handleInputChange('username', e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email *
          </label>
          <input
            type="email"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none transition-colors"
            placeholder="Enter your email"
            value={formData.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Phone Number *
          </label>
          <div className="flex">
            <select className="px-2 md:px-3 py-3 border border-gray-300 rounded-l-lg bg-white outline-none text-sm md:text-base">
              <option value="+91">🇮🇳 +91</option>
            </select>
            <input
              type="tel"
              className="flex-1 px-3 md:px-4 py-3 border-t border-r border-b border-gray-300 rounded-r-lg outline-none transition-colors text-sm md:text-base"
              placeholder="+91"
              value={formData.phoneNumber}
              onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
            />
          </div>
        </div>
      </div>

      {error && (
        <div className="text-red-600 text-sm text-center bg-red-50 p-3 rounded-lg mb-4">
          {error}
        </div>
      )}

      <button
        onClick={handleNextStep}
        className="w-full bg-[#242627] hover:bg-gray-900 text-white font-medium py-3 px-4 rounded-lg transition-colors text-sm md:text-base"
      >
        Continue
      </button>

      <div className="text-center mt-4 md:mt-6">
        <span className="text-sm md:text-base text-gray-600">Already have an account? </span>
        <Link to="/login" className="text-sm md:text-base text-gray-800 hover:text-gray-900 font-medium hover:underline">
          Login
        </Link>
      </div>
    </div>
  );


  const renderStep3 = () => (
    <div className="max-w-md w-full">
      {/* Back button */}
      <button
        onClick={handlePrevStep}
        className="flex items-center text-gray-600 hover:text-gray-800 mb-4 md:mb-6"
      >
        <svg className="w-4 h-4 md:w-5 md:h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        <span className="text-sm md:text-base">Back</span>
      </button>

      {/* Welcome text */}
      <div className="text-center mb-6 md:mb-8">
        <h2 className="text-xl md:text-2xl font-semibold text-gray-800 mb-2">Secure Your Account</h2>
        <p className="text-sm md:text-base text-gray-600">Create a strong password to protect your account</p>
      </div>

      {/* Password fields */}
      <div className="space-y-3 md:space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg outline-none transition-colors"
              placeholder="Enter your password"
              value={formData.password}
              onChange={(e) => handleInputChange('password', e.target.value)}
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
              onClick={() => setShowPassword(!showPassword)}
            >
              <svg className="h-5 w-5 text-[#ACB5BB] hover:text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {showPassword ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                )}
              </svg>
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Confirm Password
          </label>
          <div className="relative">
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg outline-none transition-colors"
              placeholder="Re-Enter your password"
              value={formData.confirmPassword}
              onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              <svg className="h-5 w-5 text-[#ACB5BB] hover:text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {showConfirmPassword ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {error && (
        <div className="text-red-600 text-sm text-center bg-red-50 p-3 rounded-lg mt-4">
          {error}
        </div>
      )}

      <button
        onClick={handleNextStep}
        className="w-full bg-[#242627] hover:bg-gray-900 text-white font-medium py-3 px-4 rounded-lg transition-colors mt-4 md:mt-6 text-sm md:text-base"
      >
        Continue
      </button>

      <div className="text-center mt-4 md:mt-6">
        <span className="text-sm md:text-base text-gray-600">Already have an account? </span>
        <Link to="/login" className="text-sm md:text-base text-gray-800 hover:text-gray-900 font-medium hover:underline">
          Login
        </Link>
      </div>
    </div>
  );

  const renderStep4 = () => (
    <div className="max-w-md w-full">
      <div className="bg-white p-4 md:p-8 rounded-lg shadow-lg">
        <h2 className="text-lg md:text-xl font-semibold text-gray-800 mb-2 text-center">Add a Profile Picture</h2>
        <p className="text-sm md:text-base text-gray-600 text-center mb-4 md:mb-6">Help others recognize you with a photo</p>

        <div className="text-center">
          {profilePicturePreview ? (
            <div className="relative inline-block">
              <img
                src={profilePicturePreview}
                alt="Profile preview"
                className="w-20 h-20 md:w-24 md:h-24 rounded-full object-cover mx-auto mb-3 md:mb-4"
              />
              <button
                onClick={() => {
                  setProfilePicture(null);
                  setProfilePicturePreview(null);
                }}
                className="absolute top-0 right-0 bg-gray-500 text-white rounded-full w-5 h-5 md:w-6 md:h-6 flex items-center justify-center text-xs md:text-sm hover:bg-gray-600"
              >
                ×
              </button>
            </div>
          ) : (
            <div className="w-20 h-20 md:w-24 md:h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3 md:mb-4">
              <svg className="w-6 h-6 md:w-8 md:h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
          )}

          <p className="text-gray-500 text-xs md:text-sm mb-3 md:mb-4">Drag and drop your photo here<br />or</p>

          <input
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            className="hidden"
            id="profile-upload"
          />
          <label
            htmlFor="profile-upload"
            className="inline-block bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 md:px-6 py-2 rounded-lg cursor-pointer transition-colors mb-4 md:mb-6 text-sm md:text-base"
          >
            Choose File
          </label>
        </div>

        <button
          onClick={handleFinalSubmit}
          disabled={isLoading}
          className="w-full bg-[#242627] hover:bg-gray-900 text-white font-medium py-3 px-4 rounded-lg transition-colors disabled:opacity-50 mb-3 md:mb-4 text-sm md:text-base"
        >
          {isLoading ? 'Creating account...' : 'Finish Setup'}
        </button>

        <button
          onClick={handleFinalSubmit}
          className="w-full text-gray-600 hover:text-gray-800 py-2 transition-colors text-sm md:text-base"
        >
          Skip For Now
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left side - Dark background - Hidden on mobile */}
      <div className="hidden md:flex md:flex-1 bg-gray-800"></div>
      
      {/* Right side - Register form */}
      <div className="flex-1 flex items-center justify-center px-4 py-8 md:px-0">
        {currentStep === 1 && renderStep1()}
        {currentStep === 2 && renderStep3()}
        {currentStep === 3 && renderStep4()}
      </div>
    </div>
  );
};

export default Register;
