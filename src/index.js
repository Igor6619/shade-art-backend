import express from 'express';
import connectDB from '#config/db.js';
import userRouter from '#routes/user.js';
import authRouter from '#routes/auth.js';
import cookieParser from 'cookie-parser';
import cors from 'cors'; // 👈 Импорт
import DotenvFlow from 'dotenv-flow';
DotenvFlow.config() 

connectDB();


let app = express();
// 🔹 Базовая настройка CORS (разрешить все источники — для разработки)
// app.use(cors());

// Или 🔹 более безопасная настройка (только для нужных источников):

app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3010',
  // origin: ['http://localhost:5173', 'http://localhost:3001'], // 👈 Порты твоего фронтенда
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  credentials: true, // 👈 Если используешь cookies / авторизацию с credentials
  allowedHeaders: ['Content-Type', 'Authorization']
}));


// 1. Парсинг JSON (для запросов с Content-Type: application/json)
app.use(express.json());
// 2. Парсинг URL-encoded (для обычных форм)
app.use(express.urlencoded({ extended: true }));
// // 3. Настройка multer для form-data (если используете FormData)
// const upload = multer();
// app.use(upload.none()); // глобально для всех запросов, или добавляйте в каждый роут
// 4. CORS (если фронт на другом порту, например 3000 vs 5000)
// app.use((req, res, next) => {
//     res.header('Access-Control-Allow-Origin', '*');
//     res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
//     res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
//     if (req.method === 'OPTIONS') {
//         return res.sendStatus(200);
//     }
//     next();
// });
// Подключите cookie-parser ДО всех роутов
app.use(cookieParser());  // Теперь req.cookies будет доступен


app.use('/auth', authRouter)
app.use('/user', userRouter)
app.get('/', function(req, res) {
	res.send('hello world');
});

app.listen(3000, function() {
	console.log('running on port: 3000!');
});

app.use(function(req, res) {
	res.status(404).send('not found');
}); 