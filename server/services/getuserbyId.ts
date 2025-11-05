import {Response} from 'express';
import redis from "../utils/redis";

export const getuserbyId = async (id: string , res: Response) => {
    const userjson = await redis.get(id);
    if(userjson){
        const  user = JSON.parse(userjson);
        res.status(200).json({
            success:true,
            user,
        });
    }
}