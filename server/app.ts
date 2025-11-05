import express,{Request,Response,NextFunction} from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import errorMiddleware from './middleware/error';
import ErrorHandler from './utils/ErrorHandler';
import userRoutes from './routes/user.routes';
import courseRoutes from './routes/course.routes';
import orderRoutes from './routes/order.routes';
import notificationRoutes from './routes/notification.routes';
import analyticRoutes from './routes/analytic.routes';
import layoutRoutes from './routes/layout.routes';
require('dotenv').config();


export const app = express();
//body parser middleware
app.use(express.json({ limit: '10mb' }));

//cookie parser middleware
app.use(cookieParser());

//cors middleware
const clientUrl = process.env.CLIENT_URL?.trim() || "http://localhost:3000";

app.use(
  cors({
    origin: clientUrl,
    credentials: true,
  })
);


app.get('/', (req:Request, res:Response,next:NextFunction) => {
    res.send('API is running....');
});
app.use('/api/v1/user',userRoutes);
app.use('/api/v1/course',courseRoutes);
app.use('/api/v1/order',orderRoutes);
app.use('/api/v1/notification',notificationRoutes);
app.use('/api/v1/analytic',analyticRoutes);
app.use('/api/v1/layout',layoutRoutes); 


app.use((req: Request, res: Response, next: NextFunction) => {
  next(new ErrorHandler(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(errorMiddleware)
