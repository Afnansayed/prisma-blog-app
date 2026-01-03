import { Request, Response } from "express";
import { postService } from "./posts.service";



const createPost= async(req:Request,res:Response) => {
    try{
        const result = await postService.createPost(req.body);
        res.status(201).json({
            message: "Post created successfully",
            data: result
        });
    } catch (error) {
        res.status(500).json({
            message: "Internal Server Error",
            error: error
        });
    }
}


const getAllPosts = async(req:Request,res:Response) => {
    const {search} = req.query;
    const searchString = typeof search === "string" ? search : undefined;
    
    const tags = req.query.tags  ? (req.query.tags as string).split(",") : [];
    // console.log(tags);
    

    
    try{
        const posts = await postService.getAllPosts({search:searchString , tags });    
        res.status(200).json({
            message: "Posts fetched successfully",
            data: posts
        });
    } catch (error) {
        res.status(500).json({
            message: "Internal Server Error",
            error: error
        });
    }
}

export const postController = {
    createPost,
    getAllPosts
}