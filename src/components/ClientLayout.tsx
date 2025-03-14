import { useSession, signOut } from "next-auth/react";

const ClientLayout = ({ children }: { children: React.ReactNode }) => {
  const { data: session, status } = useSession();
  const loading = status === "loading";

  return (
    <div>
      <header>
        <nav>
          <ul>
            <li><a href="/">Home</a></li>
            {!loading && session && (
              <>
                <li><a href="/dashboard">Dashboard</a></li>
                <li><button onClick={() => signOut()}>Sign Out</button></li>
              </>
            )}
            {!loading && !session && (
              <>
                <li><a href="/login">Login</a></li>
                <li><a href="/signup">Sign Up</a></li>
              </>
            )}
          </ul>
        </nav>
      </header>
      <main>{children}</main>
    </div>
  );
};

export default ClientLayout;
