const MyPage = ({ nonce }) => {
  return (
    <div>
      <style nonce={nonce}>{`
        body {
          background-color: #f0f0f0;
        }
      `}</style>
      <script nonce={nonce}>
        {`
          console.log('Hello, world!');
        `}
      </script>
      <h1>My Page</h1>
    </div>
  );
}

export async function getServerSideProps() {
  return {
    props: {
      nonce: nanoid(),
    },
  };
}

export default MyPage;
