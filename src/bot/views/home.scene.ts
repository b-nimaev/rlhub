import { Document, ObjectId, Schema } from "mongoose";
import { Composer, Context, Scenes } from "telegraf";
import { Message, Update } from "telegraf/typings/core/types/typegram";
import { ExtraEditMessageText, ExtraReplyMessage } from "telegraf/typings/telegram-types";
import { ISentence, Sentence } from "../../models/ISentence";
import { IUser, User } from "../../models/IUser";
import rlhubContext from "../models/rlhubContext";

const handler = new Composer<rlhubContext>();
const home = new Scenes.WizardScene("home", handler, async (ctx: rlhubContext) => await add_sentences_handler(ctx));

async function greeting (ctx: rlhubContext) {

    const extra: ExtraEditMessageText = {
        parse_mode: 'HTML',
        reply_markup: {
            inline_keyboard: [
                [
                    { text: "Самоучитель", callback_data: "study" },
                    { text: "Словарь", callback_data: "vocabular" }
                ],
                [{ text: 'Предложения', callback_data: 'sentences' }],
                [{ text: 'Переводчик', callback_data: 'translater' }],
                [{ text: 'Модерация', callback_data: 'moderation' }],
                [{ text: "Личный кабинет", callback_data: "dashboard" }]
            ]
        }
    }

    let message = `Самоучитель бурятского языка \n\nКаждое взаимодействие с ботом, \nвлияет на сохранение и дальнейшее развитие <b>Бурятского языка</b>`
    // message += `\n\nДля оцифровки и создания машинного перевода с любого языка на бурятский и обратно требуется неимоверно <b>много данных</b>`
    // message += `\n\nНаша цель собрать 100 000 корректных переводов предложений из разных сфер жизни, для создания машинного-бурятского языка`
    message += '\n\nВыберите раздел, чтобы приступить'

    try {

        ctx.updateType === 'message' ? await ctx.reply(message, extra) : false
        ctx.updateType === 'callback_query' ? await ctx.editMessageText(message, extra) : false

    } catch (err) {
        console.error(err);
    }
}

home.start(async (ctx: rlhubContext) => {
    try {

        let document: IUser | null = await User.findOne({
            id: ctx.from?.id
        })

        if (!document) {

            if (ctx.from) {

                let user: IUser = {
                    id: ctx.from.id,
                    username: ctx.from.username,
                    first_name: ctx.from.first_name,
                    translations: [],
                    voted_translations: [],
                    rating: 0,
                    is_bot: false,
                    proposedProposals: []
                }
                new User(user).save()

            }

        } else {
            await greeting(ctx)
        }

    } catch (err) {
        console.log(err)
    }
});

home.action("vocabular", async (ctx) => {
    ctx.answerCbQuery()
    return ctx.scene.enter('vocabular')
})

home.action("sentences", async (ctx) => {
    return ctx.scene.enter('sentences')
})

home.action("translater", async (ctx) => {
    return ctx.answerCbQuery('На стадии разработки 🎯')
})

home.action("study", async (ctx) => {
    return ctx.answerCbQuery('Программа обучения на стадии разработки 🎯')
})

home.action("moderation", async (ctx) => {
    ctx.answerCbQuery()
    return ctx.scene.enter('moderation')
})

home.action("dashboard", async (ctx) => {
    await ctx.answerCbQuery('Личный кабинет')
    return ctx.scene.enter('dashboard')
})

home.enter(async (ctx) => { return await greeting(ctx) })

home.command('add_sentences', async (ctx) => {
    await ctx.reply('Отправьте список предложений на русском которые хотите добавить в базу данных для их перевода в дальнейшем')
    ctx.wizard.selectStep(1)
})

async function add_sentences_handler (ctx: rlhubContext) {

    if (ctx.from) {
        try {

            if (ctx.updateType === 'callback_query') {
                if (ctx.callbackQuery) {

                    // @ts-ignore
                    if (ctx.callbackQuery.data) {

                        // @ts-ignore
                        let data: 'send_sentences' | 'back' = ctx.callbackQuery.data

                        // сохранение предложенных предложений
                        if (data === 'send_sentences') {
                            
                            for (let i = 0; i < ctx.session.sentences.length; i++) {
                                
                                let sentence: ISentence = {
                                    text: ctx.session.sentences[i],
                                    author: ctx.from.id,
                                    accepted: 'not view',
                                    translations: [],
                                    skipped_by: []
                                }

                                new Sentence(sentence).save().then(async (data) => {
                                    let object_id = data._id

                                    await User.findOneAndUpdate({ id: ctx.from?.id }, { $push: {
                                        "proposedProposals": object_id
                                    } })

                                })

                            }

                            await ctx.answerCbQuery(`${ctx.session.sentences} отправлены на проверку, спасибо!`)
                            ctx.wizard.selectStep(0)
                            await greeting(ctx)
                        }

                        if (data === 'back') {
                            ctx.wizard.selectStep(0)
                            await ctx.answerCbQuery()
                            return greeting(ctx)
                        }
                    }
                 }

            } else if (ctx.updateType === 'message') {

                // @ts-ignore
                if (ctx.message.text) {

                    // @ts-ignore
                    let text = ctx.message.text

                    let user_id: number = ctx.from.id

                    let sentence: ISentence = {
                        text: text.toLocaleLowerCase(),
                        author: user_id,
                        accepted: 'not view',
                        translations: [],
                        skipped_by: []
                    }

                    let message: string = ``

                    if (sentence.text.indexOf('+;') !== -1) {
                        let splitted = sentence.text.split('+;')
                        let arr: string[] = []
                        for (let i = 0; i < splitted.length; i++) {
                            arr.push(splitted[i].trimEnd().trimStart())
                        }

                        ctx.session.sentences = arr

                        for (let i = 0; i < splitted.length; i++) {
                            message += `${i+1}) ${splitted[i].trimStart().trimEnd()}\n`
                        }
                    } else {
                        ctx.session.sentences = [text]
                        message += text
                    }

                    await ctx.reply(message, {
                        parse_mode: 'HTML',
                        reply_markup: {
                            inline_keyboard: [
                                [
                                    {
                                        text: 'Сохранить',
                                        callback_data: 'send_sentences'
                                    }
                                ],
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

        } catch (err) {
            ctx.wizard.selectStep(0)
            await greeting(ctx)
        }
    }
    
}

handler.on("message", async (ctx) => await greeting (ctx))

export default home
export { add_sentences_handler }