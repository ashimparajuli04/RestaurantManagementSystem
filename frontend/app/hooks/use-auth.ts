import { useState, useEffect } from "react";

export default function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch user on mount
  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("access_token");
      if (!token) {
        setUser(null);
        setLoading(false);
        return;
      }

      try {
        const res = await fetch("/users/me", {
          headers: {
            "Authorization": `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          setUser(null);
        } else {
          const data = await res.json();
          setUser(data);
        }
      } catch (err) {
        console.error(err);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const isAdmin = () => user?.role === "admin";

  return { user, loading, isAdmin };
}
