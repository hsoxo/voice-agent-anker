import dynamic from "next/dynamic";

const HomePage = dynamic(() => import("@/components/JapanBankDemo"), {
  ssr: false,
});

export default function Index() {
  return <HomePage />;
}
