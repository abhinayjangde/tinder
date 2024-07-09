import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { redirect } from "next/navigation";
import { createUser, getUserById } from "../neo4j.action";

async function Callback() {

    const { isAuthenticated, getUser } = getKindeServerSession();

    if (!(await isAuthenticated())) {
        return redirect("/api/auth/login?post_login_redirect_url=http://localhost:3000/callback");
    }

    const user = await getUser();
    if (!user) {
        return redirect("/api/auth/login?post_login_redirect_url=http://localhost:3000/callback");
    }
    const dbUser = await getUserById(user.id);
    if(!dbUser) {
        // create user in neo4j
        await createUser({
            applicationId: user.id,
            email: user.email!,
            firstname: user.given_name!,
            lastname: user.family_name! ?? undefined,
        });
    }

    return redirect('/')

}

export default Callback;