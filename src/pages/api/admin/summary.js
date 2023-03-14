import { getSession } from "next-auth/react";
import Order from "models/Order";
import User from "models/User";
import Product from "models/Product";
import db from "@/utils/db";

const handler = async (req, res) => {
    const session = await getSession({ req });

    if (!session || session.user.role !== "admin") {
        return res.status(401).send("Access Denied");
    }

    await db.connect();

    const ordersCount = await Order.countDocuments();
    const usersCount = await User.countDocuments();
    const productsCount = await Product.countDocuments();

    const ordersPriceGroup = await Order.aggregate([
        {
            $group: {
                _id: null,
                total: { $sum: "$totalPrice" },
            },
        },
    ]);

    const ordersPrice = ordersPriceGroup.length > 0 ? ordersPriceGroup[0].total : 0;

    const salesData = await Order.aggregate([
        {
            $group: {
                _id: { $dateToString: { format: '%Y-%m', date: '$createdAt' } },
                totalSales: { $sum: '$totalPrice' },
            },
        },
    ]);

    await db.disconnect();
    res.send({ ordersCount, usersCount, productsCount, ordersPrice, salesData });
};

export default handler;