"use client"
import { Neo4jUser } from '@/types'
import * as React from 'react'
import TinderCard from 'react-tinder-card'
import { Card, CardDescription, CardHeader, CardTitle } from './ui/card'
import { neo4jSwip } from '@/app/neo4j.action'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface HomeProps {
  currentUser: Neo4jUser,
  users: Neo4jUser[],
}
const HomePage: React.FC<HomeProps> = ({ currentUser, users }) => {
  const handleSwipe = async (direction: string, userId:string) => {
    const match = await neo4jSwip(currentUser.applicationId,direction,userId);
    if(match){
      toast('Congratulation!')
      alert('Congratulation!')
    }
  }

  return (
    <div className='w-screen h-screen flex justify-center items-center'>
      <div>

      <div>
        <h1 className='text-4xl'>Hello, {currentUser.firstname} {currentUser.lastname}</h1>
      </div>
      <div className='mt-4 relative'>
      {
        users.map((user) => (
          <TinderCard onSwipe={(direction)=>handleSwipe(direction,user.applicationId)} key={user.applicationId} className='absolute cursor-pointer'>
            <Card>
              <CardHeader>
                <CardTitle>
                  {user.firstname} {user.lastname}
                </CardTitle>
                <CardDescription>{user.email}</CardDescription>
              </CardHeader>
            </Card>
          </TinderCard>
        ))
      }
      </div>
      </div>
    </div>
  )
}

export default HomePage