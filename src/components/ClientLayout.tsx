import dynamic from 'next/dynamic';

const ClientSession = dynamic(() => import('./ClientSession'), { ssr: false });

const ClientLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div>
      <header>
        <nav>
          <ul>
            <li><a href="/">Home</a></li>
            <ClientSession />
          </ul>
        </nav>
      </header>
      <main>{children}</main>
    </div>
  );
};

export default ClientLayout;
