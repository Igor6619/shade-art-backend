import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';



const Schema = mongoose.Schema;

const userSchema = new Schema({
    login: {
        type:String,
        required: [true, 'Имя обязательно'],
        unique: true, //Защита от дубликата
        trim: true,
        match: [/^[a-zA-Z0-9_-]+$/, 
                'Имя должно содержать любую букву латинскую (верхний/нижний регистр), цифру или нижнее подчеркивание или тирэ '], 
        // match: [/^[^\s@]+@([^\s@.,]+\.)+[^\s@.,]{2,}$/, 'Неверный email'],
        // minlength: [3, 'Слишком короткое имя'],
        // maxlength: [50, 'Слишком длинное имя'],
        validate: {
            validator: function(value) {
                return value.length > 3;
            },
            message: 'Имя должно содержать больше 3-х символов и быть без пробелов'
        },
    },
    
    password: {
        type: String,
        required: [true, 'Пароль обязателен'],
        minlength: [6, 'Пароль должен содержать минимум 6 символов'],
        select: false // не возвращать пароль в запросах по умолчанию
    },

    // 🔗 Ссылка на профиль (один к одному)
    profile: {
        type: Schema.Types.ObjectId,
        ref: 'Profile',           // Ссылается на модель 'Profile'
        unique: true,             // У пользователя может быть только один профиль
        sparse: true              // Разрешает пользователям быть без профиля
    },

    // email: {
    //     type: String,
    //     unique: true,
    //     lowercase: true,
    //     trim: true,
    //     match: [/^\S+@\S+\.\S+$/, 'Неверный формат email']
    // },

    // phone: {
    //     type: String,
    //     required: function() {
    //         return !this.email; // Обязателен, если нет email
    //     }
    // },
    // Посмотри на фронте в папке config...
    // roles = {
    //     guest: 1,
    //     user: 2,
    //     moderator: 3,
    //     admin: 100
    // }

    role: {
        type: Number,
        enum: {
            values: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 100],
            message: '{VALUE}не является допустимой ролью'
        },
        default: 2, // 2 вместо 'user'
    },
    
    isActive: {
        type: Boolean,
        default: true
    },
    
      
    
    socialAccounts: {
        vk: {
            id: { 
                type: String, 
                unique: true,   // Защита от дубликатов
                sparse: true,   // Разрешает пользователям без VK
                index: true     // Быстрый поиск при входе
            }
        }
    }

}, { timestamps: true })
// { timestamps: true } для того что-бы автоматически создавались поля
// createdAt и updatedAt и автоматически заполнялись...
// Хеширование пароля перед сохранением
userSchema.pre('save', async function() {
    if (!this.isModified('password')) return ;
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        
    } catch (err) {
        throw err;
    }
});
// Удаляем профиль при удалении пользователя
userSchema.pre('deleteOne', { document: true, query: false }, async function() {
  // Если у пользователя есть профиль — удаляем его
  if (this.profile) {
    await Profile.deleteOne({ _id: this.profile });
    console.log(' Профиль удалён вместе с пользователем');
  }
  // ✅ Ничего не возвращаем и не вызываем next() — Mongoose сам поймёт, что хук завершён
});

// Метод для проверки пароля при входе
userSchema.methods.comparePassword = async function(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};


const User = mongoose.model('User', userSchema);
export default User

