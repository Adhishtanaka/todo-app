'use client';

import { Dialog, Transition } from '@headlessui/react';
import { Fragment, useState } from 'react';

export default function UserDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);

  const openDialog = async () => {
    setIsOpen(true);

    if (!user) {
      const res = await fetch('/api/auth');
      const data = await res.json();
      if (!data.error) setUser(data);
    }
  };

  const handleLogout = () => {
    document.cookie = `token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC; secure; samesite=strict;`;
    window.location.reload();
  };

  return (
    <>
      <button
        onClick={openDialog}
        className="px-4 py-2 bg-yellow-200 text-black rounded-md hover:bg-yellow-300"
      >
        Profile
      </button>

      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={() => setIsOpen(false)}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-sm transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900"
                  >
                    User Profile
                  </Dialog.Title>

                  {user ? (
                    <div className="mt-4 space-y-4">
                      <img
                        src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}`}
                        alt="Avatar"
                        className="rounded-full w-24 h-24 mx-auto"
                      />
                      <div className="text-center">
                        <p className="text-lg font-semibold">{user.name}</p>
                        <p className="text-sm text-gray-500">{user.email}</p>
                      </div>
                    </div>
                  ) : (
                    <p className="mt-4 text-sm text-gray-500">Loading user info...</p>
                  )}

                  <div className="mt-6 flex justify-between gap-2">
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
                      onClick={handleLogout}
                    >
                      Logout
                    </button>
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent bg-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-400"
                      onClick={() => setIsOpen(false)}
                    >
                      Close
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}
