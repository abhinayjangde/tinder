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