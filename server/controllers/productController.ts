import { Request, Response } from "express";
import Product from "../models/Product";


export class ProductController{


    static create = async (req: Request, res: Response) => {
        const { categoryId, name, description, price, target } = req.body;
    
        if (!categoryId?.trim() || !name?.trim() || !description?.trim() || !price) {
            res.status(400).json({
                msg: 'Los campos nombre, precio, descripcion, objetivo y categoria son obligatorios.'
            });
            return
        }
    
        try {
            const product = await new Product({ ownerId: req.ownerId, categoryId, name, description, price, target:target?.toLowerCase() }).save();
    
             res.status(200).json({
                msg: 'Producto Creado Correctamente.',
                product
            });
        } catch (error) {
             res.status(500).json({
                msg: 'Ocurrio un problema en el servidor.',
                error
            });
        }
    }
    
    static getAll = async (req: Request, res: Response) => {
        try {
            const products = await Product.find({ ownerId: req.ownerId }).select("_id name description price image target categoryId")
    
            res.status(200).json({
                products
            });
        } catch (error) {
             res.status(500).json({
                msg: 'Ocurrio un problema en el servidor.'
            });
        }
    }
    
    static getByCategory = async (req: Request, res: Response) => {
        const { categoryId } = req.params
        try {
            const products = await Product.find({ ownerId: req.ownerId, categoryId }).select("_id name description price image target categoryId")
    
             res.status(200).json({
                products
            });
        } catch (error) {
             res.status(500).json({
                msg: 'Ocurrio un problema en el servidor.'
            });
        }
    }
    
    static edit = async (req: Request, res: Response) => {
        const { id } = req.params
        const { categoryId, name, description, price, target } = req.body;
    
        const product = await Product.findById(id)
        if (!product) {
            res.status(404).json({
                msg: "No existe el producto.",
                product
            })
            return
        }
    
        if (product.ownerId?.toString() !== req.ownerId?.toString()) {
             res.status(403).json({
                msg: "No tiene permiso para editar producto.",
            });
            return
        }
    
        if (!categoryId?.trim() || !name?.trim() || !description?.trim() || !price) {
             res.status(400).json({
                msg: 'Los campos nombre, precio, descripcion, objetivo y categoria son obligatorios.'
            });
            return
        }
    
        try {
            product.categoryId = categoryId
            product.name = name
            product.description = description
            product.price = price
            product.target = target
    
            await product.save();
    
             res.status(200).json({
                msg: 'Producto Editado Correctamente.',
                product
            });
        } catch (error) {
            res.status(500).json({
                msg: 'Ocurrio un problema en el servidor.'
            });
        }
    }
    
    static remove = async (req: Request, res: Response) => {
        const { id } = req.params
        try {
            const product = await Product.findById(id)
            if (!product) {
                 res.status(404).json({
                    msg: "No existe el producto."
                })
                return
            }
    
            if (product.ownerId?.toString() !== req.ownerId?.toString()) {
                 res.status(403).json({
                    msg: "No tiene permiso para eliminar producto."
                })
                return
            }
    
            await product.deleteOne();
    
            res.status(200).json({
                msg: 'Producto Eliminado Correctamente.'
            });
        } catch (error) {
            res.status(500).json({
                msg: 'Ocurrio un problema en el servidor.'
            });
        }
    }
    

}
