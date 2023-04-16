import { ExtraEditMessageText } from "telegraf/typings/telegram-types"
import rlhubContext from "../../models/rlhubContext"
import greeting from "./greeting"

export default async function date_birth_handler(ctx: rlhubContext) {
    try {

        let update = ctx.updateType

        if (update === 'message') {
            return await date_birth(ctx)
        }

        if (update === 'callback_query') {

            let data = ctx.update.callback_query.data

            if (data === 'back') {
                ctx.wizard.selectStep(0)
                await greeting(ctx)
            }

            ctx.answerCbQuery(data)
        }


    } catch (err) {

        console.log(err)

    }
}

export async function date_birth(ctx: rlhubContext) {
    try {

        let message = 'Настройки / Дата рождения \n\n'
        message += 'Выберите месяц рождения'
        let extra: ExtraEditMessageText = {
            parse_mode: 'HTML',
            reply_markup: {
                inline_keyboard: [
                    [
                        { text: 'Январь', callback_data: 'January' },
                        { text: 'Февраль', callback_data: 'February' },
                        { text: 'Март', callback_data: 'March' }
                    ],
                    [
                        { text: 'Апрель', callback_data: 'April' },
                        { text: 'Май', callback_data: 'May' },
                        { text: 'Июнь', callback_data: 'June' }
                    ],
                    [
                        { text: 'Июль', callback_data: 'July' },
                        { text: 'Август', callback_data: 'August' },
                        { text: 'Сентябрь', callback_data: 'September' }
                    ],
                    [
                        { text: 'Октябрь', callback_data: 'October' },
                        { text: 'Ноябрь', callback_data: 'November' },
                        { text: 'Декабрь', callback_data: 'December' }
                    ],
                    [{ text: 'Назад', callback_data: 'back' }]
                ]
            }
        }
        await ctx.editMessageText(message, extra)
        ctx.wizard.selectStep(1)
        return ctx.answerCbQuery()

    } catch (err) {

        console.log(err)

    }
}