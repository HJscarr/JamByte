'use client'

import { useState, useEffect, Fragment, useCallback, useMemo } from 'react';
import { Disclosure, Menu, MenuItems, MenuItem, Transition, MenuButton, DisclosurePanel, DisclosureButton } from '@headlessui/react';
import { Bars3Icon, XMarkIcon, UserCircleIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

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

  const { user, signOut, modalState, setModalState } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);

  const handleLoginClick = () => {
    setModalState(prev => ({ ...prev, showLoginModal: true }));
  };

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
                            ? 'text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-yellow-500'
                            : 'text-gray-300 hover:text-white',
                          'rounded-md px-3 py-2 text-lg font-medium transition-colors duration-75'
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
                    {user?.profile?.given_name ? (
                      <MenuButton className="text-white mr-4">
                        Hello, <span className="text-secondary font-semibold">{user.profile.given_name}</span>!
                      </MenuButton>
                    ) : (
                      <button
                        className="relative text-gray-200 bg-gradient-to-r from-secondary to-red-400 hover:from-pink-500 hover:to-red-500 rounded flex items-center justify-center gap-2 md:px-14 md:py-3 px-4 py-2 text-xs md:text-sm font-medium whitespace-nowrap hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 w-[120px] md:w-[140px]"
                        onClick={handleLoginClick}
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
                              onClick={signOut}
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