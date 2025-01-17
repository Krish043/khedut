import axios from 'axios';
import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import logo from '/logo.png';

export default function Signup() {

    const navigate = useNavigate();

    const [form, setForm] = useState({
        name: '',
        email: '',
        password: '',
        role: '',
        img:''
    });
    const [error, setError] = useState('');
    
    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({
            ...form,
            [name]: value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Ensure the role is selected
        if (!form.role) {
            setError('Please select a role: Farmer or Businessman.');
            return;
        }

        axios.post('http://localhost:3000/signup', form)
        .then(result => {
            if (result.data === "User with given email already Exist!") {
                setError(result.data);
            } else {
                setForm({ name: '', email: '', password: '', role: '' });
                setError('');
                navigate('/signin');
            }
        })
        .catch (error => {
			if (
				error.response &&
				error.response.status >= 400 &&
				error.response.status <= 500
			) {
				setError(error.response.data.message);
			}else {
                setError('An unexpected error occurred. Please try again later.');
            }
		})
    };

  return (
    <>
        <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-8 lg:px-8 mt-14">
          <div className="sm:mx-auto sm:w-full sm:max-w-sm">
            <img
              alt="Your Company"
            //   src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
              src={logo}
              className="mx-auto h-20 w-auto"
            />
            <h2 className="mt-2 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
              Sign up to your account
            </h2>
          </div>

          <div className="mt-4 sm:mx-auto sm:w-full sm:max-w-sm">
            <form onSubmit={handleSubmit} className="space-y-6">

            <div>
                <label htmlFor="name" className="block text-sm font-medium leading-6 text-gray-900">
                Full Name
                </label>
                <div className="mt-2">
                <input
                    id="name"
                    name="name"
                    type="text"
                    value={form.name}
                    onChange={handleChange}
                    required
                    autoComplete="name"
                    className="block w-full rounded-md border border-gray-300 bg-white ps-2 py-1.5 text-gray-900 shadow-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 sm:text-sm"
                />
                </div>
            </div>
                
              <div>
                <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
                  Email address
                </label>
                <div className="mt-2">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    required
                    autoComplete="email"
                    className="block w-full rounded-md border border-gray-300 bg-white ps-2 py-1.5 text-gray-900 shadow-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 sm:text-sm"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">
                    Password
                  </label>
                  {/* <div className="text-sm">
                    <NavLink to="#" className="font-semibold text-indigo-600 hover:text-indigo-500">
                      Forgot password?
                    </NavLink>
                  </div> */}
                </div>
                <div className="mt-2">
                  <input
                    id="password"
                    name="password"
                    type="password"
                    value={form.password}
                    onChange={handleChange}
                    required
                    autoComplete="current-password"
                    className="block w-full rounded-md border border-gray-300 bg-white ps-2 py-1.5 text-gray-900 shadow-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 sm:text-sm"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="role" className="block text-sm font-medium leading-6 text-gray-900">
                    Role
                </label>
                <div className="mt-2">
                    <select
                    id="role"
                    name="role"
                    value={form.role}
                    onChange={handleChange}
                    required
                    className="block w-full rounded-md border border-gray-300 bg-white py-1.5 px-2 text-gray-900 shadow-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 sm:text-sm"
                    >
                    <option value="" disabled>Select your role</option>
                    <option value="farmer">Farmer</option>
                    <option value="businessman">Businessman</option>
                    </select>
                </div>
              </div>

              <div>
                <label htmlFor="name" className="block text-sm font-medium leading-6 text-gray-900">
                Profile Picture URL
                </label>
                <div className="mt-2">
                <input
                    id="img"
                    name="img"
                    type="text"
                    value={form.img}
                    onChange={handleChange}
                    required
                    autoComplete="img"
                    className="block w-full rounded-md border border-gray-300 bg-white ps-2 py-1.5 text-gray-900 shadow-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 sm:text-sm"
                />
                </div>
            </div>

              {error && (
                <div className="mt-4 text-left text-sm text-red-500">
                    {error}
                </div>
              )}

              <div>
                <button
                  type="submit"
                  className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-600"
                >
                  Sign Up
                </button>
              </div>
            </form>

            <p className="mt-10 text-center text-sm text-gray-500">
            Already have an account?{' '}
              <NavLink to="/signin" className="font-semibold text-indigo-600 hover:text-indigo-500">
                Sign In
              </NavLink>
            </p>
          </div>
        </div>
    </>
  );
}