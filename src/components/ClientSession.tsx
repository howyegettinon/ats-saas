import { useSession, signOut } from "next-auth/react";

const ClientSession = () => {
  const { data: session, status } = useSession();
  const loading = status === "loading";

  if (loading) return null;

  return (
    <>
      {session ? (
        <>
          <li><a href="/dashboard">Dashboard</a></li>
          <li><button onClick={() => signOut()}>Sign Out</button></li>
        </>
      ) : (
        <>
          <li><a href="/login">Login</a></li>
          <li><a href="/signup">Sign Up</a></li>
        </>
      )}
    </>
  );
};

export default ClientSession;
