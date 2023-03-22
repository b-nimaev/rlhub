import { Composer, Scenes } from "telegraf";
import { ExtraEditMessageText, ExtraReplyMessage } from "telegraf/typings/telegram-types";
import rlhubContext from "../models/rlhubContext";

const handler = new Composer<rlhubContext>();
const home = new Scenes.WizardScene("home", handler);

async function greeting (ctx: rlhubContext) {
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

    let message = `Самоучитель бурятского языка \n\nКаждое взаимодействие с ботом, \nвлияет на сохранение и дальнейшее развитие <b>Бурятского языка</b>`
    // message += `\n\nДля оцифровки и создания машинного перевода с любого языка на бурятский и обратно требуется неимоверно <b>много данных</b>`
    message += `\n\nНаша цель собрать 100 000 корректных переводов предложений из разных сфер жизни, для создания машинного-бурятского языка`
    message += '\n\nВыберите раздел, чтобы приступить'

    try {

        ctx.updateType === 'message' ? await ctx.reply(message, extra) : false
        ctx.updateType === 'callback_query' ? await ctx.reply(message, extra) : false

    } catch (err) {
        console.error(err);
    }
}

home.start(async (ctx: rlhubContext) => await greeting(ctx));

home.action("translater", async (ctx) => {
    return ctx.answerCbQuery('На стадии разработки 🎯')
})

home.action("study", async (ctx) => {
    return ctx.answerCbQuery('Программа обучения на стадии разработки 🎯')
})

home.action("dashboard", async (ctx) => {
    await ctx.answerCbQuery('Личный кабинет')
    return ctx.scene.enter('dashboard')
})

home.on("message", async (ctx) => { return await greeting(ctx) })

home.action(/./, async (ctx) => {
    await ctx.answerCbQuery('Команда не распознана')
    return await greeting(ctx)
})

export default home