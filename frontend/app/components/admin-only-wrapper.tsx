import useAuth from "@/hooks/use-auth";

interface props{
  children: React.ReactNode;
}
export default function AdminOnlyWrapper({ children }: props) {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user || !user.isAdmin) {
    return <div>Access denied</div>;
  }

  return children;
}
