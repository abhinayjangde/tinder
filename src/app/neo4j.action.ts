"use server"
import { driver } from "@/db"
import { Neo4jUser } from "@/types";

export const getUserById = async (id: string) => {
    const result = await driver.executeQuery(`MATCH (u:User {applicationId: $applicationId}) RETURN u`, { applicationId: id });
    const users = result.records.map(record => record.get('u').properties);
    if (users.length === 0) return null;
    return users[0] as Neo4jUser;
}

export const createUser = async (user: Neo4jUser) => {
    return await driver.executeQuery(`CREATE (u:User {applicationId: $applicationId, firstname: $firstname, lastname: $lastname, email: $email}) RETURN u`, user);
}

export const getUserWithNoConnection = async (id: string) => {
    const result = await driver.executeQuery(`MATCH (cu:User {applicationId: $applicationId}) MATCH (ou: User) WHERE NOT (cu)-[:LIKE|:DISLIKE]->(cu) AND (cu) <> ou RETURN ou`, { applicationId: id });
    const users = result.records.map(record => record.get('ou').properties);
    if (users.length === 0) return null;
    return users as Neo4jUser[];
}

export const neo4jSwip = async (id:string,swipe:string,userId:string)=>{
    const type = swipe === 'right' ? 'LIKE' : 'DISLIKE';
    await driver.executeQuery(`MATCH (cu:User {applicationId: $applicationId}) MATCH (ou: User {applicationId: $userId}) CREATE (cu)-[:${type}]->(ou)`, { applicationId: id, userId });

    if(swipe === 'LIKE'){

        const result = await driver.executeQuery(`MATCH (cu:User {applicationId: $applicationId}), (ou:User {applicationId: $userId}) MATCH (ou: User) WHERE (ou)-[:LIKE]->(cu) RETURN ou as match`, { applicationId: id,userId });

        const matches = result.records.map(record => record.get('match').properties);
        return Boolean(matches.length > 0);
    }

}

export const getMatches = async (currentUserId:string)=>{
    const result = await driver.executeQuery(`MATCH (cu:User {applicationId: $applicationId})-[:LIKE]-(ou:User) RETURN ou as match`, { applicationId: currentUserId });
    const matches = result.records.map(record => record.get('match').properties);
    if (matches.length === 0) return null;
    return matches as Neo4jUser[];
}