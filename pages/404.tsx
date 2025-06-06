// pages/404.tsx
import dynamic from 'next/dynamic';

// 👇 替换为你自己的组件，或写死一个 fallback 页面
const ClientOnly404 = dynamic(() => import('@/components/Basic404'), {
  ssr: false,
  loading: () => <p>Loading...</p>,
});

export default function NotFoundPage() {
  return <ClientOnly404 />;
}
