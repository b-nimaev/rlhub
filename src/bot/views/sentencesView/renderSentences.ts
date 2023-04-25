import { ISentence, translation } from "../../../models/ISentence"
import rlhubContext from "../../models/rlhubContext"
import get_tranlations from "./getTranslations"

export async function render_sentencse_for_translate(ctx: rlhubContext, sentence: ISentence) {

    let message: string = ''

    // Текущее предложение
    // @ts-ignore
    ctx.scene.session.sentence_id = sentence._id.toString()
    message += `Отправьте перевод предложения: \n`
    message += `<code>${sentence.text}</code>`
    message += `\n\n— Буквы отсутствующие в кириллице — <code>һ</code>, <code>ү</code>, <code>өө</code>, копируем из предложенных.`

    if (sentence?.translations.length) {

        // получаем существующие переводы
        let translations: {
            author_translation: translation[],
            common_translation: translation[]
        } | false = await get_tranlations(ctx, sentence)

        // если они существуют
        if (translations) {

            // переводы посторонних
            if (translations.common_translation.length) {
                message += `\n\n<i>Переводы пользователей</i>`

                for (let i = 0; i < translations.common_translation.length; i++) {

                    message += `\n${i + 1}) ${translations.common_translation[i].translate_text}`

                }

            }

            // ваши переводы

            if (translations.author_translation.length) {
                message += `\n\n<i>Ваши переводы</i>`

                for (let i = 0; i < translations.author_translation.length; i++) {

                    message += `\n${i + 1}) ${translations.author_translation[i].translate_text}`

                }
            }
        }


    }

    // тут вывести переводы

    ctx.wizard.selectStep(4)

    return message
}