import { ObjectId } from "mongodb";
import { Composer, Scenes } from "telegraf";
import { ExtraEditMessageText } from "telegraf/typings/telegram-types";
import { ISentence, Sentence } from "../../models/ISentence";
import { IUser, User } from "../../models/IUser";
import rlhubContext from "../models/rlhubContext";

const handler = new Composer<rlhubContext>();
const sentences = new Scenes.WizardScene("sentences", handler, 
    async (ctx: rlhubContext) => await my_sentences_handler(ctx),
    async (ctx: rlhubContext) => await add_sentences_handler(ctx));

function formatMoney(amount: any) {
    return new Intl.NumberFormat('ru-RU').format(amount);
}

async function greeting(ctx: rlhubContext) {

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
                    ],[
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

        let sentences: ISentence[] = await Sentence.find({})

        let left = 100000 - sentences.length
        
        

        let message = `<b>Перевод предложений 🚀</b> \n\n`
        message += `Наша цель собрать 100 000 корректных переводов предложений из разных сфер жизни, для создания машинного-бурятского языка\n\n`
        message += `А Чтобы переводить предложения, нужны сами предложения на <b>русском языке</b>. \n\nДо конца цели осталось <b>${formatMoney(left)}</b>x`

        ctx.updateType === 'message' ? await ctx.reply(message, extra) : false
        ctx.updateType === 'callback_query' ? await ctx.editMessageText(message, extra) : false

    } catch (err) {

        console.error(err);
    }

}

sentences.enter(async (ctx: rlhubContext) => await greeting(ctx));

sentences.action('my_sentences', async (ctx) => {

    try {

        ctx.answerCbQuery()
        let message: string = `<b>Статистика</b> \n\n`
        message += `Здесь будут отображаться ваша статисика по работе с предложениями\n\n`

        let user: IUser | null = await User.findOne({ id: ctx.from?.id })
        let props_obj: {
            accepted: ISentence[],
            declined: ISentence[],
            not_view: ISentence[]
        } = {
            accepted: [],
            declined: [],
            not_view: []
        }

        if (user) {

            let props: string[] = user.proposedProposals

            for (let i = 0; i < props.length; i++) {

                let sentence: ISentence | null = await Sentence.findOne({ _id: new ObjectId(props[i]) })
                if (sentence) {
                    if (sentence.accepted === 'accepted') {
                        props_obj.accepted.push(sentence)
                    }
                    if (sentence.accepted === 'declined') {
                        props_obj.declined.push(sentence)
                    }
                    if (sentence.accepted === 'not view') {
                        props_obj.not_view.push(sentence)
                    }
                }
            }

        }

        message += `Отправлено предложений: ${props_obj.not_view.length + props_obj.accepted.length + props_obj.declined.length}\n`
        message += `Принято предложений: ${props_obj.accepted.length}\n`
        message += `Отклонено предложений: ${props_obj.declined.length}\n`
        message += `Предложений на рассмотрении: ${props_obj.not_view.length}`

        await ctx.editMessageText(message, {
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

        ctx.wizard.selectStep(1)

    } catch (err) {

        console.log(err)

    }
})

async function my_sentences_handler (ctx: rlhubContext) {

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

    } catch (err) {

        console.log(err)
        
    }

}
sentences.action("home", async (ctx) => {
    ctx.answerCbQuery()
    ctx.scene.enter('home')
})
sentences.action("add_sentence", async (ctx) => {
    ctx.answerCbQuery()
    ctx.wizard.selectStep(2)
    let message = `<b>Добавление перевода — Предложения</b>\n\n`
    message += `Отправьте список предложений на русском которые хотите добавить в базу данных для их перевода в дальнейшем`
    await ctx.editMessageText(message, { parse_mode: 'HTML', reply_markup: {
        inline_keyboard: [
            [
                {
                    text: 'Назад',
                    callback_data: 'back'
                }
            ]
        ]
    } })
})
sentences.action("translate_sentences", async (ctx) => {
    try {
        
    } catch (err) {
        console.log(err)
    }
})

async function add_sentences_handler(ctx: rlhubContext) {

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
                                    votes: [],
                                    accepted: 'not view'
                                }

                                new Sentence(sentence).save().then(async (data) => {
                                    let object_id = data._id

                                    await User.findOneAndUpdate({ id: ctx.from?.id }, {
                                        $push: {
                                            "proposedProposals": object_id
                                        }
                                    })

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
                        votes: [],
                        accepted: 'not view'
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
                            message += `${i + 1}) ${splitted[i].trimStart().trimEnd()}\n`
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

export default sentences