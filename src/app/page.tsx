import Sidebar from "@/components/sidebar";
import { auth } from "@/helpers/auth";
import Image from "next/image";
import { redirect } from "next/navigation";

export default async function Home() {
  const session = await auth();
  
  if (!session) {
    redirect('/auth/login');
  }

  return (
    <></>
  );
}
