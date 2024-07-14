import { auth } from "@/helpers/auth";

export default async function Dashboard() {
    const session = await auth();

    return (
        <></>
    )
}