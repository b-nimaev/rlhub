import { ObjectId } from "mongodb"
import { ISentence, translation, Translation } from "../../../models/ISentence"
import rlhubContext from "../../models/rlhubContext"

//
export default async function get_tranlations(ctx: rlhubContext, sentence: ISentence) {
    try {
        
        // разделяем переводы где и чьи
        let author_translation: translation[] = []
        let common_translation: translation[] = []

        // итетируем все переводы предложения
        for (let i = 0; i < sentence.translations.length; i++) {

            // получаем данные перевода
            let translation: translation | null = await Translation.findOne({
                _id: new ObjectId(sentence.translations[i])
            })

            // если данные получены
            if (translation) {

                if (translation.author === ctx.from?.id) {
                    
                    // если автор вы, пушим в нужный нам массив
                    author_translation.push(translation)
                    
                } else {
                    
                    // иначе в общий массив
                    common_translation.push(translation)

                }

            }

        }

        // Вернем объект для удобства
        return {
            author_translation,
            common_translation
        }


    } catch (err) {

        return false

    }
}