import { ExtraEditMessageText } from "telegraf/typings/telegram-types"
import { translation, Translation } from "../../../models/ISentence"
import rlhubContext from "../../models/rlhubContext"
import formatMoney from "../../utlis/format_money"

// при входе
export default async function greeting(ctx: rlhubContext) {

    try {

        const extra: ExtraEditMessageText = {
            parse_mode: 'HTML',
            reply_markup: {
                inline_keyboard: [
                    [
                        {
                            text: 'Добавить перевод',
                            callback_data: 'translate_sentences'
                        }
                    ],
                    [
                        {
                            text: 'Предложения',
                            callback_data: 'add_sentence'
                        }
                    ], [
                        {
                            text: 'Статистика',
                            callback_data: 'my_sentences'
                        }
                    ],
                    [
                        {
                            text: 'Назад',
                            callback_data: 'home'
                        }
                    ],
                ]
            }
        }

        let sentences: translation[] = await Translation.find()

        let left = 100000 - sentences.length



        let message = `<b>Перевод предложений 🚀</b> \n\n`
        message += `Наша цель собрать 100 000 корректных переводов предложений из разных сфер жизни, для создания машинного-бурятского языка\n\n`
        message += `А Чтобы переводить предложения, нужны сами предложения на <b>русском языке</b>. \n\nДо конца цели осталось <b>${formatMoney(left)} переводов</b>`

        ctx.updateType === 'message' ? await ctx.reply(message, extra) : false
        ctx.updateType === 'callback_query' ? await ctx.editMessageText(message, extra) : false

    } catch (err) {

        console.error(err);
    }

}