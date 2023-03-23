import { Composer, Scenes } from "telegraf";
import { ExtraReplyMessage, ExtraEditMessageText } from "telegraf/typings/telegram-types";
import rlhubContext from "../models/rlhubContext";

const handler = new Composer<rlhubContext>();
const settings = new Scenes.WizardScene("settings", handler);

settings.enter(async (ctx: rlhubContext) => {
    try {

        const extra: ExtraEditMessageText = {
            parse_mode: 'HTML',
            reply_markup: {
                inline_keyboard: [
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

        let message = `<b>Настройки</b> \n\nИмя пользователя: <b>${ctx.from?.first_name}</b>`

        ctx.updateType === 'message' ? await ctx.reply(message, extra) : false
        ctx.updateType === 'callback_query' ? await ctx.editMessageText(message, extra) : false

    } catch (err) {

        console.error(err);
    
    }

});

settings.action("back", async (ctx) => {
    await ctx.answerCbQuery('Личный кабинет')
    return ctx.scene.enter("dashboard")
})

settings.action("choose_ln", async (ctx) => {
    return ctx.answerCbQuery("Выбрать язык")
})

export default settings