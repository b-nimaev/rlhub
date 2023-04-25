import axios from "axios";
import { Composer, Scenes } from "telegraf";
import rlhubContext from "../models/rlhubContext";
import greeting from "./vocabularView/greeting";

const handler = new Composer<rlhubContext>();
const vocabular = new Scenes.WizardScene("vocabular", handler, async (ctx: rlhubContext) => await translate_word(ctx));

async function translate_word(ctx: rlhubContext) {
    try {

        if (ctx.updateType === 'callback_query') {
            if (ctx.callbackQuery) {

                //@ts-ignore
                if (ctx.callbackQuery.data) {

                    // @ts-ignore
                    let data: 'back' = ctx.callbackQuery.data

                    if (data === "back") {

                        ctx.wizard.selectStep(0)
                        await greeting(ctx)

                    }

                }
            }
        }

        if (ctx.updateType === 'message') {

            if (ctx.message) {
                if (ctx.message.text) {

                    // @ts-ignore
                    let word: string = ctx.message.text
                    let language: string = ctx.session.language

                    let response = await axios.get(`https://burlang.ru/api/v1/${language}/translate?q=${word}`)
                        .then(function (response) {
                            return response.data
                        })
                        .catch(function (error) {
                            return error
                        });

                    let message: string = ''

                    if (response.translations) {
                        message = response.translations[0].value
                    } else {
                        if (language === 'russian-word') {
                            message = 'Перевод отсутствует'
                        } else {
                            message = 'Оршуулга угы байна..'
                        }
                    }


                    await ctx.reply(message, {
                        parse_mode: 'HTML',
                        reply_markup: {
                            inline_keyboard: [
                                [
                                    {
                                        text: 'Назад',
                                        callback_data: 'back'
                                    }
                                ]
                            ]
                        }
                    })

                } else {
                    await ctx.reply("Нужно отправить в текстовом виде")
                }
            }

        }

    } catch (err) {

        console.log(err)

    }
}

vocabular.enter(async (ctx: rlhubContext) => await greeting(ctx));

handler.action("back", async (ctx) => {
    await ctx.answerCbQuery()
    return ctx.scene.enter("home")
})

vocabular.action("russian", async (ctx) => {
    ctx.answerCbQuery()
    ctx.wizard.selectStep(1)
    ctx.session.language = 'russian-word'
    await render_translate_section(ctx)
})

vocabular.action("buryat", async (ctx) => {
    ctx.answerCbQuery()
    ctx.wizard.selectStep(1)
    ctx.session.language = 'buryat-word'
    await render_translate_section(ctx)
})

async function render_translate_section(ctx: rlhubContext) {

    try {

        let message = 'Отправьте слово которое нужно перевести'
        await ctx.editMessageText(message, {
            parse_mode: 'HTML',
            reply_markup: {
                inline_keyboard: [
                    [
                        {
                            text: 'назад',
                            callback_data: 'back'
                        }
                    ]
                ]
            }
        })

    } catch (err) {

        console.log(err)

    }

}

handler.on("message", async (ctx: rlhubContext) => await greeting(ctx))

export default vocabular