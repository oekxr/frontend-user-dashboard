import { useEffect, useRef } from "react";

function Detail({ label, children }) {
  return (
    <div className="grid gap-1 py-3 sm:grid-cols-[6rem_1fr] sm:gap-4">
      <dt className="text-sm text-slate-500">{label}</dt>
      <dd className="wrap-anywhere text-sm leading-6 text-slate-800">{children || "—"}</dd>
    </div>
  );
}

export default function UserDetailsModal({ user, onClose }) {
  const dialogRef = useRef(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    const previousFocus = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    dialog.showModal();
    document.body.style.overflow = "hidden";
    return () => {
      dialog.close();
      document.body.style.overflow = previousOverflow;
      if (previousFocus instanceof HTMLElement) previousFocus.focus();
    };
  }, []);

  const address = [user.address?.address, user.address?.city, user.address?.state, user.address?.postalCode, user.address?.country].filter(Boolean).join(", ");

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby="detail-title"
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
      className="m-auto max-h-[85dvh] w-[calc(100%-2rem)] max-w-md hide-scrollbar overflow-y-auto rounded-2xl border-0 bg-white p-0 text-slate-900 shadow-xl backdrop:bg-slate-950/40"
    >
      <div className="sticky top-0 flex items-start justify-between gap-4 border-b border-slate-100 bg-white px-6 py-5">
        <div className="min-w-0">
          <h2 id="detail-title" className="wrap-anywhere text-lg font-semibold">
            {user.name}
          </h2>
          {user.username && <p className="mt-1 wrap-anywhere text-sm text-slate-500">@{user.username}</p>}
        </div>
        <button
          type="button"
          autoFocus
          onClick={onClose}
          aria-label="Tutup profil"
          className="flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-lg text-xl text-slate-500 hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700"
        >
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <dl className="divide-y divide-slate-100 px-6 py-2">
        <Detail label="Email">{user.email}</Detail>
        <Detail label="Telepon">{user.phone}</Detail>
        <Detail label="Alamat">{address}</Detail>
        <Detail label="Perusahaan">{user.company?.name}</Detail>
        <Detail label="Jabatan">{user.company?.title}</Detail>
        <Detail label="Departemen">{user.company?.department}</Detail>
      </dl>
    </dialog>
  );
}
