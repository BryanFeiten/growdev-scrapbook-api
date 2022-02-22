import express, { Request, Response, NextFunction }from 'express';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

app.get('/', (request: Request, response: Response) => {
    return response.status(200).json("OK");
})

app.listen(PORT, () => console.log(`Server running on port: ${PORT}`));