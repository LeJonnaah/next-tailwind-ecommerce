import { getSession } from "next-auth/react";
import Product from "models/Product";
import db from "@/utils/db";

const handler = async (req, res) => {

    const session = await getSession({ req });

    if (!session || (session && !session.user.isAdmin)) {
        return res.status(401).send("Not authorized");
    }

    const { user } = session;

    if (req.method === "GET") {
        return getHandler(req, res, user);

    } else if (req.method === "PUT") {
        return putHandler(req, res, user);
    } else if (req.method === "DELETE") {
        return deleteHandler(req, res, user);
    } else {
        return res.status(405).send("Method not allowed");
    }
};

const getHandler = async (req, res) => {
    await db.connect();
    const product = await Product.findById(req.query.id);
    await db.disconnect();
    res.send(product);
}

const putHandler = async (req, res) => {
    await db.connect();
    const product = await Product.findById(req.query.id);
    if (product) {
        product.name = req.body.name;
        product.slug = req.body.slug;
        product.price = req.body.price;
        product.image = req.body.image;
        product.brand = req.body.brand;
        product.category = req.body.category;
        product.countInStock = req.body.countInStock;
        product.description = req.body.description;
        await product.save();
        await db.disconnect();
        res.send({ message: "Product Updated" });
    } else {
        await db.disconnect();
        res.status(404).send({ message: "Product Not Found" });
    }
}

const deleteHandler = async (req, res) => {
    await db.connect();
    const product = await Product.findById(req.query.id);
    if (product) {
        await product.remove();
        await db.disconnect();
        res.send({ message: 'Product deleted successfully' });
    } else {
        await db.disconnect();
        res.status(404).send({ message: 'Product not found' });
    }
};

export default handler;