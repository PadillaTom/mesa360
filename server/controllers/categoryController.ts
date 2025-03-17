import { Request, Response } from "express";
import Category from "../models/Category";

export class CategoryController{


    static  create = async (req: Request, res: Response) => {
        const { name, description } = req.body;
    
        if (!name?.trim() || !description?.trim()) {
             res.status(400).json({
                msg: 'Debes ingresar un nombre y una descripcion.'
            });
            return
        }
    
        try {
            const category = await new Category({ ownerId: req.ownerId, name, description }).save();
    
             res.status(200).json({
                msg: 'Categoria Creada Correctamente.',
                category
            });
        } catch (error) {
             res.status(500).json({
                msg: 'Ocurrio un problema en el servidor.'
            });
        }
    }
    
    static  getAll = async (req: Request, res: Response) => {
        try {
            const categories = await Category.find({ ownerId: req.ownerId }).select("_id name description image")
    
             res.status(200).json({
                categories: categories
            });
        } catch (error) {
             res.status(500).json({
                msg: 'Ocurrio un problema en el servidor.'
            });
        }
    }
    
    static  edit = async (req: Request, res: Response) => {
        const { id } = req.params
        const { name, description } = req.body;
    
        const category = await Category.findById(id)
        if (!category) {
             res.status(404).json({
                msg: "No existe la categoria."
            })
            return
        }
    
        if (category.ownerId?.toString() !== req.ownerId?.toString()) {
             res.status(403).json({
                msg: "No tiene permiso para editar categoria."
            })
            return
        }
    
        if (!name?.trim() || !description?.trim()) {
           res.status(400).json({
                msg: 'Debes ingresar un nombre y una descripcion.'
            });
            return 
        }
    
        try {
            category.name = name
            category.description = description
    
            await category.save();
    
             res.status(200).json({
                msg: 'Categoria Editada Correctamente.',
                category
            });
        } catch (error) {
             res.status(500).json({
                msg: 'Ocurrio un problema en el servidor.'
            });
        }
    }
    
    static  remove = async (req: Request, res: Response) => {
        const { id } = req.params
    
        const category = await Category.findOne({_id:id})

        if (!category) {
            res.status(404).json({
                msg: "No existe la categoria."
            })
            return
        }
    
        if (category.ownerId?.toString() !== req.ownerId?.toString()) {
             res.status(403).json({
                msg: "No tiene permiso para eliminar categoria."
            })
            return
        }
      
        try {
            await category.deleteOne()
       
    
             res.status(200).json({
                msg: 'Categoria Eliminada Correctamente.'
            });
        } catch (error) {
    
             res.status(500).json({
                msg: 'Ocurrio un problema en el servidor.'
            });
        }
    }
    
}
