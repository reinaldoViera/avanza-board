'use client'

import { Fragment as ReactFragment } from 'react';
import { Menu, MenuButton, MenuItem, MenuItems, Transition } from '@headlessui/react'
import { signOut } from 'firebase/auth'
import { auth } from '@/lib/firebase'
import { useAuth } from '@/features/auth/AuthProvider'

export function UserNav() {
  const { user } = useAuth()

  const handleSignOut = () => {
    signOut(auth)
  }

  return (
    <Menu as="div" className="relative">
      <MenuButton className="-m-1.5 flex items-center p-1.5">
        <span className="sr-only">Open user menu</span>
        <img
          className="h-8 w-8 rounded-full bg-gray-50"
          src={user?.photoURL || `https://api.dicebear.com/7.x/initials/svg?seed=${user?.email}`}
          alt=""
        />
      </MenuButton>
      <Transition
        as={ReactFragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <MenuItems className="absolute right-0 z-10 mt-2.5 w-32 origin-top-right rounded-md bg-white py-2 shadow-lg ring-1 ring-gray-900/5 focus:outline-none dark:bg-gray-800 dark:ring-gray-700">
          <MenuItem>
            {({  focus }) => (
              <button
                onClick={handleSignOut}
                className={`
                  block w-full px-3 py-1 text-left text-sm leading-6
                  ${focus ? 'bg-gray-50 dark:bg-gray-700' : ''}
                  ${focus ? 'text-primary-600' : 'text-gray-900 dark:text-gray-300'}
                `}
              >
                Sign out
              </button>
            )}
          </MenuItem>
        </MenuItems>
      </Transition>
    </Menu>
  )
}
