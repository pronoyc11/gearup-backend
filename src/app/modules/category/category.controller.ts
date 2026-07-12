import type { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { categoryService } from "./category.service";
import { sendResponse } from "../../utils/sendResponse";


const createCategory = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    const category = await categoryService.createCategoryInDB(req.body);

    sendResponse(res, {
        success: true,
        statusCode: 200,
        message: "Category Created successfully",
        data: category
    })

})

const getAllCategory = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    const category = await categoryService.getAllCategoryFromDB();

    sendResponse(res, {
        success: true,
        statusCode: 200,
        message: "Category retrieved successfully",
        data: category
    })
})

const deleteCategory = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    const category = await categoryService.deleteCategory(req.params.categoryId as string);

    sendResponse(res, {
        success: true,
        statusCode: 200,
        message: "Category deleted successfully",
        data: category
    })

})

const updateCategory = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    const category = await categoryService.updateCategory(req.params.categoryId as string, req.body);

    sendResponse(res, {
        success: true,
        statusCode: 200,
        message: "Category updated successfully",
        data: category
    })

})
export const categoryController = {
    createCategory,
    getAllCategory,
    deleteCategory,
    updateCategory
}