import { Composer, Scenes } from "telegraf";
import { ExtraEditMessageText, ExtraReplyMessage } from "telegraf/typings/telegram-types";
import rlhubContext from "../models/rlhubContext";

const handler = new Composer<rlhubContext>();
const dashboard = new Scenes.WizardScene("dashboard", handler);

dashboard.enter(async (ctx: rlhubContext) => {

    const extra: ExtraEditMessageText = {
        parse_mode: 'HTML',
        reply_markup: {
            inline_keyboard: [
                [
                    {
                        text: 'Настройки',
                        callback_data: 'common_settings'
                    }
                ], [
                    {
                        text: 'О проекте',
                        callback_data: 'about'
                    }
                ], [
                    {
                        text: 'Поддержка проекта',
                        callback_data: 'help'
                    }
                ],
                [
                    {
                        text: 'Назад',
                        callback_data: 'home'
                    },
                    {
                        text: 'Обратная связь',
                        callback_data: 'contact'
                    }
                ],
            ]
        }
    }

    let words = []
    let message = `<b>Личный кабинет</b> \n\nОбщий рейтинг: 100 \nДобавлено слов: 0 \nСлов на модерации: ${words.length} \nПереведено предложений: 0`

    try {

        ctx.updateType === 'message' ? await ctx.reply(message, extra) : false
        ctx.updateType === 'callback_query' ? await ctx.editMessageText(message, extra) : false

    } catch (err) {
        console.error(err);
    }

});

dashboard.action("common_settings", async (ctx) => {
    await ctx.answerCbQuery('Личный кабинет / Настройки')
    return ctx.scene.enter('settings')
})

dashboard.action("about", async (ctx) => {
    return ctx.answerCbQuery('О проекте ...')
})

dashboard.action("help", async (ctx) => {
    return ctx.answerCbQuery('Помощь проекту')
})

dashboard.action("home", async (ctx) => {
    return ctx.scene.enter('home')
})

dashboard.action("contact", async (ctx) => {
    return ctx.answerCbQuery('Обратная связь')
})

export default dashboard