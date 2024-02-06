import Image from "next/image";
import Sidebar from "./components/sidebar";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24 bg-slate-900">
      <Sidebar/>

    </main>
  );
}
