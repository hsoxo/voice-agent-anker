// 可选，不写也没问题；写了就用 SSR 防止 preload
export async function getServerSideProps() {
    return { props: {} };
  }
  
  export default function ErrorPage({ statusCode }: { statusCode?: number }) {
    return (
      <div>
        <h1>{statusCode || 500} - An error occurred</h1>
      </div>
    );
  }
  