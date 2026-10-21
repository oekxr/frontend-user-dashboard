const pageButton =
  "cursor-pointer rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium transition hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-white";

export default function UserTable({ users, onSelect, page, pageCount, onPageChange, startIndex, total }) {
  return (
    <>
      <div className="hide-scrollbar overflow-x-auto focus-visible:outline-2 focus-visible:outline-inset focus-visible:outline-emerald-700" role="region" aria-label="Tabel user, geser untuk melihat semua kolom" tabIndex={0}>
        <table className="w-full min-w-160 text-left text-sm">
          <caption className="sr-only">Daftar user. Pilih nama untuk membuka profil user.</caption>
          <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
            <tr>
              <th scope="col" className="w-16 px-6 py-3.5 font-medium">
                No.
              </th>
              <th scope="col" className="px-4 py-3.5 font-medium">
                Nama
              </th>
              <th scope="col" className="px-4 py-3.5 font-medium">
                Email
              </th>
              <th scope="col" className="px-6 py-3.5 font-medium">
                Perusahaan
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {users.map((user, index) => (
              <tr
                key={user.id}
                className="cursor-pointer transition hover:bg-emerald-50/50"
                onClick={(event) => {
                  event.currentTarget.querySelector("button").focus();
                  onSelect(user);
                }}
              >
                <td className="px-6 py-4 text-slate-400">{startIndex + index + 1}</td>
                <th scope="row" className="px-4 py-4 font-medium">
                  <button
                    type="button"
                    aria-label={`Buka profil ${user.name}`}
                    aria-haspopup="dialog"
                    className="cursor-pointer rounded text-left text-slate-900 hover:text-emerald-700 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-emerald-700"
                  >
                    {user.name}
                  </button>
                </th>
                <td className="px-4 py-4 text-slate-600">{user.email}</td>
                <td className="px-6 py-4 text-slate-600">{user.company?.name || "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex flex-col gap-4 border-t border-slate-200 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
        <p role="status" className="text-sm text-slate-500">
          {startIndex + 1}–{Math.min(startIndex + users.length, total)} dari {total} user
        </p>
        <nav aria-label="Halaman user" className="flex flex-wrap items-center gap-1.5">
          <button type="button" onClick={() => onPageChange(page - 1)} disabled={page === 1} className={pageButton} aria-label="Halaman sebelumnya">
            &lsaquo;
          </button>
          {Array.from({ length: pageCount }, (_, index) => index + 1).map((number) => (
            <button
              key={number}
              type="button"
              onClick={() => onPageChange(number)}
              aria-label={`Halaman ${number}`}
              aria-current={page === number ? "page" : undefined}
              className={`${pageButton} ${page === number ? "border-emerald-700 bg-emerald-700 text-white hover:bg-emerald-800" : "text-slate-600"}`}
            >
              {number}
            </button>
          ))}
          <button type="button" onClick={() => onPageChange(page + 1)} disabled={page === pageCount} className={pageButton} aria-label="Halaman berikutnya">
            &rsaquo;
          </button>
        </nav>
      </div>
    </>
  );
}
