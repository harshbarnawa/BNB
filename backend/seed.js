
require("dotenv").config();

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const User = require("./model/User");
const Product = require("./model/Product");
const Order = require("./model/Order");

const seed = async () => {
    try {
        if (!process.env.MONGO_URI) {
            throw new Error("MONGO_URI is missing");
        }

        await mongoose.connect(process.env.MONGO_URI);

        console.log("Connected to MongoDB");

        const password = await bcrypt.hash("DemoPass123!", 10);

        const usersData = [
            {
                name: "Aarav Sharma",
                email: "aarav@example.com",
                password,
                role: "user",
                verified: true
            },
            {
                name: "Diya Patel",
                email: "diya@example.com",
                password,
                role: "user",
                verified: true
            },
            {
                name: "BNB Admin",
                email: "admin@example.com",
                password,
                role: "admin",
                verified: true
            }
        ];

        for (const user of usersData) {
            await User.updateOne(
                { email: user.email },
                { $setOnInsert: user },
                { upsert: true }
            );
        }

        const users = await User.find({
            email: { $in: usersData.map(user => user.email) }
        });

        const productsData = [
            {
                name: "Logitech G102 Gaming Mouse",
                description: "High precision gaming mouse with customizable RGB lighting and 8000 DPI sensor.",
                price: 1499,
                category: "Mouse",
                stock: 35,
                imageUrl: "https://images.unsplash.com/photo-1527814050087-3793815479db",
                ratings: 4.5,
                numReviews: 120
            },
            {
                name: "Mechanical RGB Keyboard",
                description: "Premium mechanical keyboard with RGB backlighting and tactile switches.",
                price: 2999,
                category: "Keyboard",
                stock: 20,
                imageUrl: "https://images.unsplash.com/photo-1595225476474-87563907a212",
                ratings: 4.7,
                numReviews: 85
            },
            {
                name: "Gaming Headset",
                description: "Over-ear gaming headset with immersive audio and noise cancelling microphone.",
                price: 1999,
                category: "Headphones",
                stock: 25,
                imageUrl: "https://images.unsplash.com/photo-1599669454699-248893623440",
                ratings: 4.3,
                numReviews: 64
            },
            {
                name: "24 Inch Gaming Monitor",
                description: "Full HD gaming monitor with high refresh rate and fast response time.",
                price: 10999,
                category: "Monitor",
                stock: 12,
                imageUrl: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf",
                ratings: 4.6,
                numReviews: 92
            },
            {
                name: "16GB DDR4 RAM",
                description: "High performance desktop memory for gaming and multitasking.",
                price: 3299,
                category: "RAM",
                stock: 30,
                imageUrl: "https://images.unsplash.com/photo-1562976540-1502c2145186",
                ratings: 4.4,
                numReviews: 48
            },
            {
                name: "1TB NVMe SSD",
                description: "High speed NVMe storage for faster boot times and file transfers.",
                price: 5499,
                category: "Storage",
                stock: 18,
                imageUrl: "https://images.unsplash.com/photo-1597872200969-2b65d56bd16b",
                ratings: 4.8,
                numReviews: 105
            },
            {
                name: "Gaming PC Cabinet",
                description: "Mid tower cabinet with tempered glass side panel and RGB fans.",
                price: 4499,
                category: "Cabinet",
                stock: 15,
                imageUrl: "https://images.unsplash.com/photo-1587202372775-e229f172b9d7",
                ratings: 4.2,
                numReviews: 36
            },
            {
                name: "Gaming Laptop",
                description: "Performance laptop suitable for gaming, editing and productivity.",
                price: 74999,
                category: "Laptop",
                stock: 5,
                imageUrl: "https://images.unsplash.com/photo-1603302576837-37561b2e2302",
                ratings: 4.7,
                numReviews: 76
            },
            {
                name: "NVIDIA Graphics Card",
                description: "Dedicated graphics card for gaming, rendering and creative workloads.",
                price: 28999,
                category: "Graphics Card",
                stock: 8,
                imageUrl: "https://images.unsplash.com/photo-1591488320449-011701bb6704",
                ratings: 4.6,
                numReviews: 58
            },
            {
                name: "Intel Core i5 Processor",
                description: "Multi-core desktop processor for gaming and everyday productivity.",
                price: 14999,
                category: "Processor",
                stock: 10,
                imageUrl: "https://images.unsplash.com/photo-1555617981-dac3880eac6e",
                ratings: 4.5,
                numReviews: 43
            },
            {
                name: "Wireless Gaming Mousepad",
                description: "Large extended mousepad with smooth tracking surface and anti-slip base.",
                price: 699,
                category: "Accessories",
                stock: 50,
                imageUrl: "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7",
                ratings: 4.1,
                numReviews: 29
            },
            {
                name: "USB-C Multiport Hub",
                description: "Multiport USB-C hub with HDMI, USB 3.0 and SD card connectivity.",
                price: 1299,
                category: "Accessories",
                stock: 40,
                imageUrl: "https://images.unsplash.com/photo-1625842268584-8f3296236761",
                ratings: 4.3,
                numReviews: 32
            }
        ];

        for (const product of productsData) {
            await Product.updateOne(
                { name: product.name },
                { $setOnInsert: product },
                { upsert: true }
            );
        }

        const products = await Product.find({
            name: { $in: productsData.map(product => product.name) }
        });

        const productMap = new Map(
            products.map(product => [product.name, product])
        );

        const ordersData = [
            {
                user: users[0],
                items: [
                    { name: "Logitech G102 Gaming Mouse", qty: 2 },
                    { name: "Mechanical RGB Keyboard", qty: 1 }
                ],
                status: "delivered",
                paymentId: "BNB_SEED_001"
            },
            {
                user: users[1],
                items: [
                    { name: "Gaming Headset", qty: 1 }
                ],
                status: "shipped",
                paymentId: "BNB_SEED_002"
            },
            {
                user: users[0],
                items: [
                    { name: "24 Inch Gaming Monitor", qty: 1 },
                    { name: "16GB DDR4 RAM", qty: 2 }
                ],
                status: "delivered",
                paymentId: "BNB_SEED_003"
            },
            {
                user: users[1],
                items: [
                    { name: "1TB NVMe SSD", qty: 1 },
                    { name: "Wireless Gaming Mousepad", qty: 1 }
                ],
                status: "pending",
                paymentId: "BNB_SEED_004"
            },
            {
                user: users[0],
                items: [
                    { name: "Gaming Laptop", qty: 1 }
                ],
                status: "shipped",
                paymentId: "BNB_SEED_005"
            }
        ];

        for (const order of ordersData) {
            const items = order.items.map(item => {
                const product = productMap.get(item.name);

                if (!product) {
                    throw new Error(`Product not found: ${item.name}`);
                }

                return {
                    productId: product._id,
                    qty: item.qty,
                    price: product.price
                };
            });

            const totalAmount = items.reduce(
                (total, item) => total + item.price * item.qty,
                0
            );

            await Order.updateOne(
                { paymentId: order.paymentId },
                {
                    $setOnInsert: {
                        user: order.user._id,
                        items,
                        totalAmount,
                        address: {
                            fulName: order.user.name,
                            street: "123 Demo Street",
                            city: "Indore",
                            state: "Madhya Pradesh",
                            postalCode: "452001",
                            country: "India"
                        },
                        paymentId: order.paymentId,
                        status: order.status
                    }
                },
                { upsert: true }
            );
        }

        console.log("================================");
        console.log("BNB DATABASE SEEDED SUCCESSFULLY");
        console.log("Users: 3");
        console.log("Products: 12");
        console.log("Orders: 5");
        console.log("Demo Password: DemoPass123!");
        console.log("================================");

    } catch (error) {
        console.error("Seed failed:", error);
        process.exitCode = 1;
    } finally {
        await mongoose.disconnect();
    }
};

seed();
