'use client'

import { useState, useEffect, Fragment, useCallback, useMemo } from 'react';
import { Disclosure, Menu, MenuItems, MenuItem, Transition, MenuButton, DisclosurePanel, DisclosureButton } from '@headlessui/react';
import { Bars3Icon, XMarkIcon, UserCircleIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { getCurrentUser, fetchUserAttributes, signOut } from 'aws-amplify/auth';
import { useCookiesContext } from '../context/CookiesContext';
import { useUser } from '../context/UserContext';
import { AmplifyUser, UserAttributes } from '../data/user';

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}

export const Navbar = () => {
  const pathname = usePathname();
  const navigation = useMemo(() => [
    { name: 'Home', href: '/', current: pathname === '/' },
    { name: 'Courses', href: '/courses', current: pathname === '/courses' },
    { name: 'CV Mentor', href: '/cv-mentor', current: pathname === '/cv-mentor' },
    { name: 'Contact', href: '/contact', current: pathname === '/contact' },
    { name: 'About', href: '/about', current: pathname === '/about' },
  ], [pathname]);

  const { user, setUser, setModalState } = useUser();
  const [, setCookiesSet] = useCookiesContext();
  const [isScrolled, setIsScrolled] = useState(false);

  const checkUser = useCallback(async () => {
    try {
      const currentUser = await getCurrentUser();
      const userAttributes = await fetchUserAttributes();
      
      const attributes: UserAttributes = {
        username: currentUser.username,
        email: userAttributes.email || '',
        firstName: userAttributes.given_name || ''
      };

      const amplifyUser: AmplifyUser = { attributes };
      
      setUser(amplifyUser);
      console.log("User attributes are fetched");
    } catch (error) {
      console.error("User is not signed in", error);
      setUser(null);
    }
  }, [setUser]);

  useEffect(() => {
    checkUser();
  }, [checkUser]);

  useEffect(() => {
    if (user?.attributes?.email) {
      fetch(`https://41ivi5p9sj.execute-api.eu-west-1.amazonaws.com/Prod/?email=${user.attributes.email}`)
        .then(response => response.json())
        .then(data => {
          console.log("Received cookie data:", data);
          
          // Try different approaches for different environments
          const isLocalhost = window.location.hostname === 'localhost';
          const cookieOptions = isLocalhost
            ? 'Path=/; Secure; SameSite=None'
            : 'Domain=.jambyte.io; Path=/; Secure; SameSite=None';
  
          try {
            // Approach 1: Set cookies individually with full options
            const cookies = [
              `CloudFront-Policy=${encodeURIComponent(data['CloudFront-Policy'])}`,
              `CloudFront-Signature=${encodeURIComponent(data['CloudFront-Signature'])}`,
              `CloudFront-Key-Pair-Id=${encodeURIComponent(data['CloudFront-Key-Pair-Id'])}`
            ];
  
            cookies.forEach(cookie => {
              const fullCookie = `${cookie}; ${cookieOptions}`;
              console.log('Setting cookie:', fullCookie);
              document.cookie = fullCookie;
            });
  
            // Verify immediately after setting
            const currentCookies = document.cookie;
            console.log('Current cookies after setting:', currentCookies);
  
            // Check if cookies were actually set
            const policyCookie = document.cookie.match(/CloudFront-Policy=([^;]*)/);
            const signatureCookie = document.cookie.match(/CloudFront-Signature=([^;]*)/);
            const keyPairCookie = document.cookie.match(/CloudFront-Key-Pair-Id=([^;]*)/);
  
            if (!policyCookie || !signatureCookie || !keyPairCookie) {
              console.warn('Some cookies not set. Trying alternative approach...');
              
              // Try alternative approach using a proxy endpoint
              return fetch('/api/set-cookies', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
                credentials: 'include'
              });
            }
  
            setCookiesSet(true);
          } catch (error) {
            console.error('Error setting cookies:', error);
            setCookiesSet(false);
          }
        })
        .catch(err => {
          console.error('Error in cookie setting process:', err);
          setCookiesSet(false);
        });
    }
  }, [user]);
  
  const handleSignOut = useCallback(async () => {
    try {
      await signOut();
      setUser(null);
  
      // Clear cookies exactly as in working version
      const cookieOptions = 'Domain=.jambyte.io; Path=/; SameSite=None; Secure;';
      document.cookie = `CloudFront-Policy=; expires=Thu, 01 Jan 1970 00:00:00 UTC; ${cookieOptions}`;
      document.cookie = `CloudFront-Signature=; expires=Thu, 01 Jan 1970 00:00:00 UTC; ${cookieOptions}`;
      document.cookie = `CloudFront-Key-Pair-Id=; expires=Thu, 01 Jan 1970 00:00:00 UTC; ${cookieOptions}`;
  
      setCookiesSet(false);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  }, [setUser, setCookiesSet]);

  return (
    <Disclosure as="nav" className={`w-full z-50 transition duration-300 ease-in-out ${isScrolled ? 'bg-opacity-90 bg-gray-transparent' : 'bg-transparent'}`}>
      {({ open }) => (
        <>
          <div className="mx-auto max-w-xs md:max-w-7xl sm:px-6 lg:px-8 z-40">
            <div className="relative flex h-40 items-center justify-between">
              <div className="flex flex-1 items-center justify-between sm:items-center sm:justify-start">
                <div className="flex items-center">
                  <Link href="/">
                    <Image
                      src="/img/jambyte_logo.webp"
                      alt="Your Company"
                      width={44}
                      height={44}
                    />
                  </Link>
                  <div className="sm:hidden">
                    {/* Mobile menu button*/}
                    <DisclosureButton className="relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                      <span className="absolute -inset-0.5" />
                      <span className="sr-only">Open main menu</span>
                      {open ? (
                        <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                      ) : (
                        <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                      )}
                    </DisclosureButton>
                  </div>
                </div>
                <div className="hidden sm:ml-6 sm:block">
                  <div className="flex space-x-8 items-center">
                    {navigation.map((item) => (
                      <Link
                        key={item.name}
                        href={item.href}
                        className={classNames(
                          item.current
                            ? 'bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-yellow-500'
                            : 'text-gray-300 hover:bg-clip-text hover:text-transparent hover:bg-gradient-to-r hover:from-pink-500 hover:to-yellow-500',
                          'rounded-md px-3 py-2 text-lg font-medium transition-all duration-300 ease-in-out'
                        )}
                        aria-current={item.current ? 'page' : undefined}
                      >
                        {item.name}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
              <div className="absolute inset-y-0 right-0 w-auto flex items-center sm:static sm:inset-auto sm:ml-6 sm:pr-0">
            <Menu as="div" className="relative ml-3">
              <div>
                {user?.attributes?.firstName ? (
                  <MenuButton className="text-white mr-4">
                    Hello, <span className="text-secondary font-semibold">{user.attributes.firstName}</span>!
                  </MenuButton>
                ) : (
                  <button
                    className="relative text-gray-200 bg-gradient-to-r from-secondary to-red-400 hover:from-pink-500 hover:to-red-500 rounded flex items-center justify-center gap-2 md:px-14 md:py-3 px-4 py-2 text-xs md:text-sm font-medium whitespace-nowrap hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 w-[120px] md:w-[140px]"
                    onClick={() => setModalState(prev => ({ ...prev, showLoginModal: !prev.showLoginModal }))}
                  >
                    <span>Sign In/Up</span>
                    <UserCircleIcon className="h-3 w-3 md:h-5 md:w-5 flex-shrink-0 text-white" />
                  </button>
                )}
              </div>
              <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
              >
                <MenuItems className="absolute right-0 z-40 mt-2 w-auto origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                  {user ? (
                    <MenuItem>
                      {({ focus }) => (
                        <button
                          onClick={handleSignOut}
                          className={`${
                            focus ? 'bg-gray-100' : ''
                          } block w-full px-4 py-2 text-sm text-gray-700 text-left`}
                        >
                          Sign out
                        </button>
                      )}
                    </MenuItem>
                  ) : null}
                </MenuItems>
              </Transition>
            </Menu>
          </div>
            </div>
          </div>

          <DisclosurePanel className="sm:hidden">
            <div className="space-y-1 px-2 pb-3 pt-2">
              {navigation.map((item) => (
                <DisclosureButton
                  key={item.name}
                  as="a"
                  href={item.href}
                  className={classNames(
                    item.current ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                    'block rounded-md px-3 py-2 text-lg font-medium'
                  )}
                  aria-current={item.current ? 'page' : undefined}
                >
                  {item.name}
                </DisclosureButton>
              ))}
            </div>
          </DisclosurePanel>
        </>
      )}
    </Disclosure>
  )
}

export default Navbar;