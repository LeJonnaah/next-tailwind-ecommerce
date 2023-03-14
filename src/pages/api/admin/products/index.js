import { getSession } from "next-auth/react";
import Product from "models/Product";
import db from "@/utils/db";

const handler = async (req, res) => {

    const session = await getSession({ req });

    if (!session || (session && !session.user.isAdmin)) {
        return res.status(401).send("Not authorized");
    }

    if (req.method === "GET") {
        return getHandler(req, res);
    } else {
        return res.status(405).send("Method not allowed");
    }
};

const getHandler = async (req, res) => {
    await db.connect();
    const products = await Product.find({});
    await db.disconnect();
    res.send(products);
}

export default handler;