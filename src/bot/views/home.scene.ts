import { Composer, Scenes } from "telegraf";
import { ExtraEditMessageText, ExtraReplyMessage } from "telegraf/typings/telegram-types";
import rlhubContext from "../models/rlhubContext";

const handler = new Composer<rlhubContext>();
const home = new Scenes.WizardScene("home", handler);

home.start(async (ctx: rlhubContext) => {

    const extra: ExtraReplyMessage | ExtraEditMessageText = {
        parse_mode: 'HTML',
        reply_markup: {
            inline_keyboard: [
                [
                    { text: "Самоучитель", callback_data: "study" },
                    { text: "Словарь", callback_data: "vocabular" }
                ],
                [{ text: 'Переводчик', callback_data: 'translater' }],
                [{ text: 'Модерация', callback_data: 'moderation' }],
                [{ text: "Личный кабинет", callback_data: "dashboard" }]
            ]
        }
    }

    let message = `Самоучитель бурятского языка \n\nКаждое взаимодействие с ботом, \nвлияет на сохранение и дальнейшее развитие <b>Бурятского языка</b> \n\nВыберите раздел, чтобы приступить`

    try {
        
        ctx.updateType === 'message' ? await ctx.reply(message, extra) : false
        ctx.updateType === 'callback_query' ? await ctx.reply(message, extra) : false

    } catch (err) {
        console.error(err);
    }

});

export default home