import "server-only"
import neo4j from "neo4j-driver";


export const driver = neo4j.driver(
    process.env.NEO4J_URI as string || "bolt://localhost:7687",
    neo4j.auth.basic(
        process.env.NEO4J_USER as string || "neo4j",
        process.env.NEO4J_PASSWORD as string || "password"
    )
);