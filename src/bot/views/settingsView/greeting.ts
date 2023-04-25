import { ExtraEditMessageText } from "telegraf/typings/telegram-types"
import rlhubContext from "../../models/rlhubContext"

export default async function greeting(ctx: rlhubContext) {

    try {

        const extra: ExtraEditMessageText = {
            parse_mode: 'HTML',
            reply_markup: {
                inline_keyboard: [[
                    {
                        text: 'Указать пол',
                        callback_data: 'choose_gender'
                    }
                ],
                [
                    {
                        text: 'Указать дату рождения',
                        callback_data: 'date_birth'
                    }
                ],
                [{
                    text: 'Выбрать язык интерфейса',
                    callback_data: 'choose_ln'
                }
                ],
                [{
                    text: 'Назад',
                    callback_data: 'back'
                }],
                ]
            }
        }

        let message: string = ''

        if (ctx.from) {
            if (ctx.from?.first_name) {
                message = `<b>Личный кабинет / Настройки</b> \n\nИмя пользователя: <b>${ctx.from?.first_name}</b>`
            } else {
                message = `<b>Настройки</b> \n\nИмя пользователя: <b>${ctx.from?.id}</b>`
            }
        }

        ctx.updateType === 'message' ? await ctx.reply(message, extra) : false
        ctx.updateType === 'callback_query' ? await ctx.editMessageText(message, extra) : false

    } catch (err) {

        console.error(err);

    }

}