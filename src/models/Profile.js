// models/Profile.js
import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const profileSchema = new Schema({
    // 🔗 Обратная ссылка на пользователя (тоже уникальная)
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true  // Профиль принадлежит только одному пользователю
    },

    // 📝 Поле name (и другие данные профиля)
    name: {
        type: String,
        required: [true, 'Имя в профиле обязательно'],
        trim: true,
        minlength: [2, 'Имя должно быть не короче 2 символов'],
        maxlength: [50, 'Имя не должно превышать 50 символов']
    },

    surname: {
        type: String,
        trim: true
    },

    patronymic: {
        type: String,
        trim: true
    },

    avatar: {
        type: String,
        default: null
    },

    bio: {
        type: String,
        maxlength: [500, 'Описание не должно превышать 500 символов']
    }

}, { 
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

//  Индекс для быстрого поиска по имени (опционально)
profileSchema.index({ name: 'text' });
// Создадим виртуальное поле Полное имя
profileSchema.virtual('fullname').get(function(){
    const patronymic = this.patronymic ? this.patronymic:''; 
    return `${this.name} ${patronymic}`
})

const Profile = mongoose.model('Profile', profileSchema);
export default Profile;