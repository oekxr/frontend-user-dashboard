import { useEffect, useState } from "react";

const USERS_URL = "https://dummyjson.com/users?limit=30&select=firstName,lastName,username,email,phone,address,company";

export default function useUsers() {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    let active = true;
    let timedOut = false;
    const timeout = setTimeout(() => {
      timedOut = true;
      controller.abort();
    }, 15000);

    async function loadUsers() {
      setIsLoading(true);
      setError("");
      try {
        const response = await fetch(USERS_URL, { signal: controller.signal });
        if (!response.ok) throw new Error("Request failed");
        const data = await response.json();
        if (!Array.isArray(data?.users) || !data.users.every((user) => user && Number.isInteger(user.id) && typeof user.firstName === "string" && typeof user.lastName === "string" && typeof user.email === "string"))
          throw new Error("Invalid response");
        const normalizedUsers = data.users.map((user) => ({
          id: user.id,
          name: `${user.firstName} ${user.lastName}`.trim(),
          username: user.username,
          email: user.email,
          phone: user.phone,
          address: user.address,
          company: user.company,
        }));
        if (active) setUsers(normalizedUsers);
      } catch {
        if (active) setError(timedOut ? "Server terlalu lama merespons. Silakan coba lagi." : "Data user belum dapat dimuat. Periksa koneksi internet lalu coba lagi.");
      } finally {
        clearTimeout(timeout);
        if (active) setIsLoading(false);
      }
    }

    loadUsers();
    return () => {
      active = false;
      clearTimeout(timeout);
      controller.abort();
    };
  }, [attempt]);

  return { users, isLoading, error, retry: () => setAttempt((value) => value + 1) };
}
