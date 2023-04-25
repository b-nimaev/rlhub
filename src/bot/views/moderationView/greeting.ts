import { ExtraEditMessageText } from "telegraf/typings/telegram-types"
import rlhubContext from "../../models/rlhubContext"

export default async function greeting(ctx: rlhubContext) {

    try {

        let message: string = `<b>Модерация</b>\n\n`
        message += `Выберите раздел чтобы приступить`

        const extra: ExtraEditMessageText = {
            parse_mode: 'HTML',
            reply_markup: {
                inline_keyboard: [
                    [{ text: 'Модерация предложений', callback_data: 'moderation_sentences' }],
                    [{ text: 'Модерация переводов', callback_data: 'moderation_translates' }],
                    [{ text: 'Модерация словаря', callback_data: 'moderation_vocabular' }],
                    [{ text: 'Назад', callback_data: 'back' }]
                ]
            }
        }

        ctx.updateType === 'message' ? await ctx.reply(message, extra) : false
        ctx.updateType === 'callback_query' ? await ctx.editMessageText(message, extra) : false

    } catch (err) {

        console.error(err);

    }

}