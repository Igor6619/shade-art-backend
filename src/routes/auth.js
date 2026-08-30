import express from 'express';
import multer from 'multer';
import User from '#models/User.js';
import Profile from '#models/Profile.js'; 
import { AuthService } from '#libs/auth.service.js';


 


let authRouter = express.Router();
const upload = multer();


authRouter.post('/registration', upload.none(), async function(req, res) {

    console.log(req.body)
    if (req.body.password !== req.body.confirmation_password) {
        return res.status(400).json({ 
            success: false, 
            message: 'Пароли не совпадают' 
        });
    }

    try{
        const user = new User({
            login:req.body.login,
            password:req.body.password
        });
        await user.save();
        // Создаём профиль и привязываем к пользователю
        const profile = new Profile({
            user: user._id,  // Связь с пользователем
            name:'Пользователь'
        });
        await profile.save();    

        // Связываем пользователя с профилем
        user.profile = profile._id;
        await user.save();
    
        console.log("Сохранен объект", user);
        console.log('и профиль', )
        //  Успешная регистрация
        res.status(201).json({ 
            success: true, 
            message: 'Регистрация успешна',
            user: {
                id: user._id,
                role: user.role
            }
        })
    } catch(error) {
        console.error('Ошибка регистрации:', error);
        //  Проверяем ошибку дубликата для MongoDB это 11000
        if (error.code === 11000) {
            return res.status(400).json({ 
                success: false, 
                message: 'Пользователь с таким логином уже существует' 
            });
        } else {
             return res.status(400).json({ 
                success: false, 
                message: 'Ошибка при регистрации пользователя!' 
            });
        }

    }
    
   
});


authRouter.post('/login', upload.none(), async function(req, res) {
    
    console.log('login data: ', req.body)
    try {
        const { login, password } = req.body;
        const { token, user } = await AuthService.login(login, password);
        // Установка JWT в httpOnly cookie
        res.cookie('jwt', token, {
        httpOnly: true,                    // ❌ недоступен для JS (защита от XSS)
        sameSite: 'lax',                   // ✅ защита от CSRF
        maxAge: 7 * 24 * 60 * 60 * 1000,   // 7 дней в миллисекундах
        path: '/',                         // доступна на всех путях домена
        });

        return res.status(200).json({
            status: true,
            message: 'Успешный вход',
            data: {token, 
                    user: {
                        _id:user._id,
                        
                        role:user.role
                    }
                }
        });
               
    } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ status: false, message: 'Internal server error' });
  }
});


authRouter.post('/logout', function(req, res) {
    console.log(`User logout`);
    console.log('Token: ', req.cookies.jwt)
    try{
        const token = req.cookies.jwt;
        if (token){
            console.log('Token есть!!')
                // Очищаем cookie
            res.clearCookie('jwt');
            return res.status(200).json({ 
                status: true, 
                message: 'Logout успешно!' 
            });
        }
    } catch(error) {
        console.log('Ошибка при logout');
        return res.status(500).json({ 
                status: false, 
                message: 'Logout с ошибкой!' 
            });
    }

});


export default authRouter;