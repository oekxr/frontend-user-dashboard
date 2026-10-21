import { useState } from "react";
import UserTable from "./components/UserTable.jsx";
import UserDetailsModal from "./components/UserDetailsModal.jsx";
import useUsers from "./hooks/useUsers.js";

const PAGE_SIZE = 10;

function App() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [selectedUser, setSelectedUser] = useState(null);
  const { users, isLoading, error, retry } = useUsers();
  const query = search.trim().toLowerCase();
  const filteredUsers = users.filter((user) => user.name.toLowerCase().includes(query) || user.email.toLowerCase().includes(query));
  const pageCount = Math.max(1, Math.ceil(filteredUsers.length / PAGE_SIZE));
  const currentPage = Math.min(page, pageCount);
  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const visibleUsers = filteredUsers.slice(startIndex, startIndex + PAGE_SIZE);

  function handleSearch(value) {
    setSearch(value);
    setPage(1);
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 antialiased">
      <main className="mx-auto max-w-5xl px-5 py-8 sm:px-8 sm:py-10">
        <section aria-labelledby="users-heading" className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
          <div className="border-b border-slate-200 px-6 py-5">
            <h2 id="users-heading" className="text-lg font-semibold">
              Tabel User
            </h2>
            <label htmlFor="user-search" className="sr-only">
              Cari user
            </label>
            <div className="relative mt-4">
              <input
                id="user-search"
                type="search"
                value={search}
                onChange={(event) => handleSearch(event.target.value)}
                disabled={isLoading || Boolean(error)}
                placeholder="Cari nama atau email..."
                className="w-full rounded-lg border border-slate-300 bg-white py-3 pr-12 pl-4 text-sm placeholder:text-slate-400 focus:border-emerald-700 focus:outline-2 focus:outline-offset-2 focus:outline-emerald-700 disabled:bg-slate-50 disabled:text-slate-400"
              />
              <svg
                aria-hidden="true"
                focusable="false"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="pointer-events-none absolute top-1/2 right-4 size-5 -translate-y-1/2 text-slate-400"
              >
                <circle cx="10.5" cy="10.5" r="6.5" />
                <path d="m16 16 4 4" />
              </svg>
            </div>
            {!isLoading && !error && query && (
              <p className="mt-3 text-sm text-slate-500">
                {filteredUsers.length} hasil dari {users.length} user
              </p>
            )}
          </div>
          {isLoading ? (
            <div role="status" className="px-6 py-16 text-center">
              <span aria-hidden="true" className="mx-auto mb-4 block size-7 rounded-full border-2 border-slate-200 border-t-emerald-700 motion-safe:animate-spin" />
              <p className="text-sm text-slate-600">Memuat data user...</p>
            </div>
          ) : error ? (
            <div role="alert" className="px-6 py-14 text-center">
              <p className="font-semibold text-slate-800">Gagal memuat user</p>
              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-600">{error}</p>
              <button
                type="button"
                onClick={retry}
                className="mt-5 cursor-pointer rounded-lg bg-emerald-700 px-5 py-2.5 text-sm font-semibold text-white hover:bg-emerald-800 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-emerald-700"
              >
                Coba lagi
              </button>
            </div>
          ) : filteredUsers.length > 0 ? (
            <UserTable users={visibleUsers} onSelect={setSelectedUser} page={currentPage} pageCount={pageCount} onPageChange={setPage} startIndex={startIndex} total={filteredUsers.length} />
          ) : (
            <div className="px-6 py-16 text-center">
              <p className="font-semibold text-slate-800">{users.length === 0 ? "Belum ada user" : "User tidak ditemukan"}</p>
              <p className="mt-2 text-sm leading-6 text-slate-500">{users.length === 0 ? "Daftar user masih kosong." : "Coba nama atau email lain."}</p>
              {search && (
                <button
                  type="button"
                  onClick={() => handleSearch("")}
                  className="mt-4 cursor-pointer rounded px-3 py-2 text-sm font-semibold text-emerald-700 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700"
                >
                  Hapus pencarian
                </button>
              )}
            </div>
          )}
        </section>
      </main>
      {selectedUser && <UserDetailsModal user={selectedUser} onClose={() => setSelectedUser(null)} />}
    </div>
  );
}

export default App;
