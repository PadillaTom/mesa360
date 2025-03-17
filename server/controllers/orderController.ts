import { Request, Response } from "express";
import Order from "../models/Order";
import Product from "../models/Product";

export class OrderController{


    static  create = async (req: Request, res: Response) => {
        const { tableNumber, people, items, discount, discountPercentage, serviceBy } = req.body;
    
        if (!tableNumber || !people) {
             res.status(400).json({
                msg: 'Los campos numero de mesa y cantidad de personas son obligatorios.'
            });
            return
        }
    
        try {
            const orderExist = await Order.findOne({ tableNumber, status: "pending" });
    
            if (orderExist) {
                 res.status(400).json({ msg: `Existe una orden pendiente en la mesa ${tableNumber}.` });
                 return
                }
    
    
            let subtotal = 0;
            let total = 0
            if (Array.isArray(items) && items.length > 0) {
                for (const item of items) {
                    const product = await Product.findById(item.productId);
                    if (!product) {
                         res.status(404).json({ msg: `Producto con ID ${item.productId} no encontrado` });
                         return
                        }
                    subtotal += product.price * item.quantity;
                    item.price = product.price
                    item.comentaries = item.comentaries
                }
    
                const discountPer = discountPercentage ? (subtotal * discountPercentage) / 100 : 0;
                total = subtotal - (discount || 0) - discountPer;
            }
    
    
            const newOrder = new Order({
                ownerId: req.ownerId,
                tableNumber,
                people,
                items,
                subtotal,
                discount,
                discountPercentage,
                total,
                serviceBy
            });
    
    
            await newOrder.save();
    
             res.status(201).json({
                msg: 'Orden Creada Correctamente.',
                order: newOrder
            });
        } catch (error) {
            res.status(500).json({
                msg: 'Ocurrio un problema en el servidor.'
            });
        }
    }
    
    static  getAll = async (req: Request, res: Response) => {
    
        try {
    
            let orders = await Order.find({ ownerId: req.ownerId })
                .populate("tableNumber")
                .populate("serviceBy")
    
          res.status(200).json(orders);
        } catch (error) {
             res.status(500).json({
                msg: 'Ocurrio un problema en el servidor.'
            });
        }
    }
    
    static  edit = async (req: Request, res: Response) => {
        const { id } = req.params
        const { tableNumber, people, items, discount,discountPercentage, serviceBy } = req.body;
    
        try {
            const order = await Order.findOne({ _id: id, status: 'pending' })
            if (!order) {
                 res.status(404).json({
                    msg: "No existe la orden o ya no es posible editar."
                })
                return
            }
    
            if (order.ownerId?.toString() !== req.ownerId?.toString()) {
                 res.status(403).json({
                    msg: "No tiene permiso para editar la orden.",
                });
                return
            }
    
            if (!tableNumber?.trim() || !people) {
                
                 res.status(400).json({
                    msg: 'Los campos numero de mesa y cantidad de personas son obligatorios.'
                });
                return
            }
            let subtotal = 0;
            let total=0
            if (Array.isArray(items) && items.length > 0) {
                for (const item of items) {
                    const product = await Product.findById(item.productId);
                    if (!product) {
                         res.status(404).json({ msg: `Producto con ID ${item.productId} no encontrado` });
                         return
                        }
                    subtotal += product.price * item.quantity;
                    item.price = product.price
                    item.comentaries = item.comentaries
                }
    
                const discountPer = discountPercentage ? (subtotal * discountPercentage) / 100 : 0;
                total = subtotal - (discount || 0) - discountPer;
            }
           
    
            order.tableNumber = tableNumber
            order.people = people
            order.items = items
            order.discount = discount
            order.discountPercentage=discountPercentage
            order.subtotal = subtotal
            order.serviceBy = serviceBy
            order.total = total
    
            await order.save();
    
             res.status(200).json({
                msg: 'Orden Editada Correctamente.',
                order
            });
        } catch (error) {
    
            res.status(500).json({
                msg: 'Ocurrio un problema en el servidor.'
            });
        }
    }
    
    static  updateStatus = async (req: Request, res: Response) => {
        const { id, status } = req.body;
    
        const order = await Order.findById(id)
        if (!order) {
             res.status(404).json({
                msg: "No existe la orden."
            })
            return
        }
        try {
            if(status==="completed"){
                order.closedAt=new Date()
            }
            order.status = status
            await order.save();
    
            res.status(200).json({
                order,
                msg: 'Estado Actualizado Correctamente.'
            });
        } catch (error) {
             res.status(500).json({
                msg: 'Ocurrio un problema en el servidor.'
            });
        }
    }
    
    
    static  getById = async (req: Request, res: Response) => {
    
        try {
            const { id } = req.params
            const order = await Order.findOne({ ownerId: req.ownerId, _id: id })
                .populate("tableNumber")
                .populate("serviceBy")
                .populate("items.productId", "name")
                .select("-__v -ownerId -items._id")
                .lean()
    
            const formattedOrder = {
                ...order,
                items: order.items.map((item) => ({
                    productId: item.productId["_id"],
                    name: item.productId["name"],
                    price: item.price,
                    quantity: item.quantity,
                    comentaries: item.comentaries
                })),
            };
    
             res.status(200).json({
                order: formattedOrder
            });
        } catch (error) {
             res.status(500).json({
                msg: 'Ocurrio un problema en el servidor.'
            });
        }
    }
    
    static  getOrderByTable = async (req: Request, res: Response) => {
    
        try {
            const { tableId } = req.params
    
    
            const order = await Order.findOne({ ownerId: req.ownerId, tableNumber: tableId, status: 'pending' })
                .populate("tableNumber")
                .populate("serviceBy")
                .populate("items.productId", "name")
                .select("-__v -ownerId -items._id")
                .lean()
    
            if (!order) {
                const order = {
                    tableNumber: tableId,
                    items: [],
                    status: "pending"
                }
                res.json({ msg: "No se encontro la orden", order });
                return 
            }
            const formattedOrder = {
                ...order,
                items: order.items.map((item) => ({
                    productId: item.productId["_id"],
                    name: item.productId["name"],
                    price: item.price,
                    quantity: item.quantity,
                    comentaries: item.comentaries
                })),
            };
    
            res.status(200).json({
                order: formattedOrder
            });
        } catch (error) {
           res.status(500).json({
                msg: 'Ocurrio un problema en el servidor.'
            });
        }
    }
    
    static  remove = async (req: Request, res: Response) => {
        const { id } = req.params
        try {
            const order = await Order.findById(id)
            if (!order) {
                 res.status(404).json({
                    msg: "No existe la orden."
                })
                return
            }
    
            if (order.ownerId?.toString() !== req.ownerId?.toString()) {
                 res.status(403).json({
                    msg: "No tiene permiso para eliminar la orden."
                })
                return
            }
    
            await order.deleteOne();
    
             res.status(200).json({
                msg: 'Orden Eliminada Correctamente.'
            });
        } catch (error) {
             res.status(500).json({
                msg: 'Ocurrio un problema en el servidor.'
            });
        }
    }

}
