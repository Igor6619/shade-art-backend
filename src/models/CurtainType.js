// models/CurtainType.js
import mongoose from 'mongoose';
import slugify from 'slugify'

const Schema = mongoose.Schema;

const curtainTypeSchema = new Schema({
    title: {
    type: String,
    required: [true, 'Название вида штор обязательно для заполнения'],
    trim: true,
    unique: true
  },

    slug: {
    type: String,
    unique: true,
    lowercase: true,
    trim: true
  },
  
  shortDescription: {
    type: String,
    trim: true,
    maxlength: [500, 'Краткое описание не должно превышать 500 символов']
  },
  
  mainImage: {
    url: { type: String, required: true },
    alt: { type: String, default: '' }
  },
  
  gallery: [{
    url: { type: String, required: true },
    alt: { type: String, default: '' },
    caption: { type: String, default: '' } // Подпись к фото в портфолио
  }],
  
  iconUrl: {
    type: String // Ссылка на SVG/PNG для меню и фильтров
  },

  seo: {
    title: { type: String, trim: true },
    description: { type: String, trim: true },
    h1: { type: String, trim: true }
  },

});


// Хук срабатывает перед каждым сохранением (save) или обновлением
curtainTypeSchema.pre('validate', async function(next) {
  
    // Генерируем слаг только если заголовок изменился или слага еще нет (новый документ)
    if (!this.isModified('title') && this.slug) {
        return next();
    }
    // Базовая генерация слага из заголовка
    let generatedSlug = slugify(this.title, {
        lower: true,      // переводит в нижний регистр
        strict: true,     // удаляет спецсимволы, кроме тире
        locale: 'ru'      // учитывает кириллические символы (если установлен slugify >= 1.6.0)
    });

    // Проверка на уникальность
    let counter = 1;
    let currentSlug = generatedSlug;
    let slugExists = true;
    // Если такой слаг уже существует в БД, добавляем порядковый номер в конец (например, -1, -2)
    while (slugExists) {
        const existingDoc = await this.constructor.findOne({ 
            slug: currentSlug, 
            _id: { $ne: this._id } 
        });
        if (!existingDoc) {
        slugExists = false;
        } else {
        currentSlug = `${generatedSlug}-${counter}`;
        counter++;
        }
    }

    this.slug = currentSlug;
    next();
});

const CurtainType = mongoose.model('CurtainType', curtainTypeSchema);
export default CurtainType;