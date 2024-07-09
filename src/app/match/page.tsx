import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import { redirect } from 'next/navigation';
import React from 'react'
import { getMatches, getUserById, getUserWithNoConnection } from '../neo4j.action';

const MatchPage = async () => {
    const { isAuthenticated, getUser } = getKindeServerSession();

  if (!(await isAuthenticated())) {
    return redirect("/api/auth/login?post_login_redirect_url=http://localhost:3000/callback")
  }

  const user = await getUser();
  if (!user) {
    return redirect("/api/auth/login?post_login_redirect_url=http://localhost:3000/callback")
  }

  const usersWithNoConnection = await getUserWithNoConnection(user.id);
  const currentUser = await getUserById(user.id);
  const matches = await getMatches(user.id);
  return (
    <div>
        <h1>Matches</h1>
        {
            matches && matches.map((match) => (
            <div key={match.applicationId}>
                <h2 className='text-3xl'>{match.firstname} {match.lastname}</h2>
                <p>{match.email}</p>
            </div>
            ))
        }
    </div>
  )
}

export default MatchPage