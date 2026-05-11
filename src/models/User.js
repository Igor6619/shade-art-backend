import mongoose from 'mongoose';


const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: {
        type:String,
        required: [true, 'Имя обязательно'],
        trim: true,
        match: [/^[a-zA-Z0-9_]+$/, 
                'Имя должно содержать любую букву латинскую (верхний/нижний регистр), цифру или нижнее подчеркивание '], 
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
    
    email: {
        type: String,
        unique: true,
        lowercase: true,
        trim: true,
        match: [/^\S+@\S+\.\S+$/, 'Неверный формат email']
    },

    phone: {
        type: String,
        required: function() {
            return !this.email; // Обязателен, если нет email
        }
    },
    
    role: {
        type: String,
        enum: {
            values: ['user', 'admin', 'moderator'],
            message: '{VALUE} не поддерживается'
        },
        default: 'user'
    },
    
    isActive: {
        type: Boolean,
        default: true
    },
    
    createdAt: {
        type: Date,
        default: Date.now,
        immutable: true  // Нельзя изменить после создания
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

})