import { text } from "body-parser";
import e from "express";
import { ObjectId } from "mongodb";
import { Document } from "mongoose";
import { Composer, Scenes } from "telegraf";
import { ExtraEditMessageText } from "telegraf/typings/telegram-types";
import { ISentence, Sentence, Translation, translation } from "../../models/ISentence";
import { IUser, User } from "../../models/IUser";
import rlhubContext from "../models/rlhubContext";

const handler = new Composer<rlhubContext>();
const sentences = new Scenes.WizardScene("sentences", handler, 
    async (ctx: rlhubContext) => await my_sentences_handler(ctx),
    async (ctx: rlhubContext) => await add_sentences_handler(ctx),
    async (ctx: rlhubContext) => await translate_sentences_handler(ctx),
    async (ctx: rlhubContext) => await add_translate_to_sentences_hander(ctx))

function formatMoney(amount: any) {
    return new Intl.NumberFormat('ru-RU').format(amount);
}

// при входе
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

// статистика
sentences.action('my_sentences', async (ctx) => await my_sentences(ctx))
async function my_sentences (ctx: rlhubContext) {
    try {

        let message: string = `<b>Статистика</b> \n\n`
        let extra: ExtraEditMessageText = {
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
        }

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

        if (ctx.updateType === 'callback_query') {

            ctx.answerCbQuery()
            await ctx.editMessageText(message, extra)

        } else {

            await ctx.reply(message, extra)
        
        }

        ctx.wizard.selectStep(1)

    } catch (err) {

        console.log(err)

    }
}
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
        } else {
            await my_sentences (ctx)
        }

    } catch (err) {

        console.log(err)
        
    }

}

// перевод предложений
sentences.action("translate_sentences", async (ctx) => await translate_sentences(ctx))
async function translate_sentences (ctx: rlhubContext) {
    try {

        let message: string = '<b>Добавление перевода 🎯</b>\n\n'
        message += 'Я буду давать предложение за предложением для перевода, можно заполнять данные без остановки.\n\n'
        message += `Несколько важных правил:\n`
        message += `— Переводим слово в слово\n`
        message += `— Используем минимум ород угэнуудые \n`
        message += `— Всё предложением пишем на кириллице \n`
        message += `— Не забываем про знаки препинания \n\n`
        message += `— Буквы отсутствующие в кириллице — <code>һ</code>, <code>ү</code>, <code>өө</code>, копируем из предложенных. \n❗️При клике на них, скопируется нужная буква \n\n`
        message += `<b>И помните, чем качественнее перевод — тем дольше проживет язык</b>`
        let extra: ExtraEditMessageText = {
            parse_mode: 'HTML',
            reply_markup: {
                inline_keyboard: [
                    [
                        {
                            text: 'Начать',
                            callback_data: 'start'
                        },
                        {
                            text: 'Назад',
                            callback_data: 'back'
                        }
                    ]
                ]
            }
        }
        
        if (ctx.updateType === 'callback_query') {
            await ctx.editMessageText(message, extra)
        } else {
            await ctx.reply(message, extra)
        }

        ctx.wizard.selectStep(3)

    } catch (err) {
        console.log(err)
    }
}

async function render_sentencse_for_translate (ctx: rlhubContext, sentence: ISentence) {
    
    let message: string = ''
    
    // @ts-ignore
    ctx.scene.session.sentence_id = sentence?._id.toString()
    message += `Отправьте перевод предложения: \n`
    message += `<code>${sentence?.text}</code>`
    message += `\n\n— Буквы отсутствующие в кириллице — <code>һ</code>, <code>ү</code>, <code>өө</code>, копируем из предложенных.`

    if (sentence?.translations.length) {
        message += `\n\n<i>Существующие переводы:</i>`

        for (let i = 0; i < sentence.translations.length; i++) {

            let translation: translation | null = await Translation.findOne({
                _id: new ObjectId(sentence.translations[i])
            })

            if (translation) {
                message += `\n${i+1}) ${translation.translate_text}`
            }

        }

    }

    // тут вывести переводы

    ctx.wizard.selectStep(4)

    return message
}

async function render_sft (ctx: rlhubContext) {
    try {

        let message: string = `<b>Перевод предложений</b>\n\n`;
        let extra: ExtraEditMessageText = {
            parse_mode: 'HTML',
            reply_markup: {
                inline_keyboard: [
                    [
                        {
                            text: 'Пропустить',
                            callback_data: 'skip'
                        },
                        {
                            text: 'Назад',
                            callback_data: 'back'
                        }
                    ]
                ]
            }
        }

        let sentence = await Sentence.findOne({
            skipped_by: {
                $ne: ctx.from?.id
            }
        }).sort({ 'translations.length': 1 })


        if (sentence) {

            await render_sentencse_for_translate(ctx, sentence).then((response: string) => {
                message += response
            })
            
        } else {
            
            message += `Предложений не найдено`
            
        }
        
        if (ctx.updateType === 'callback_query') {
            ctx.answerCbQuery()
            return await ctx.editMessageText(message, extra)
        } else {
            return await ctx.reply(message, extra)
        }



    } catch (err) {
        
        console.log(err)

    }
}

async function translate_sentences_handler (ctx: rlhubContext) {

    if (ctx.from) {
        try {

            if (ctx.updateType === 'callback_query') {

                // @ts-ignore
                if (ctx.callbackQuery.data) {

                    // @ts-ignore
                    let data: 'back' | 'start' = ctx.callbackQuery.data

                    if (data === 'back') {

                        await greeting(ctx)
                        ctx.wizard.selectStep(0)

                    }

                    if (data === 'start') {

                        await render_sft(ctx)

                    }

                }

            } else {
                await translate_sentences(ctx)
            }

        } catch (err) {

            console.log(err)

        }
    }

}

// добавление перевода предложения
async function add_translate_to_sentences_hander(ctx: rlhubContext) {
    if (ctx.from) {
        try {

            if (ctx.updateType === 'callback_query') {

                // @ts-ignore
                if (ctx.callbackQuery.data) {

                    // @ts-ignore
                    let data: 'back' | 'skip' = ctx.callbackQuery.data

                    if (data === 'back') {

                        await translate_sentences(ctx)

                    }

                    if (data === 'skip') {

                        await Sentence.findOneAndUpdate({
                            _id: new ObjectId(ctx.session.__scenes.sentence_id)
                        }, {
                            $push: {
                                skipped_by: ctx.from.id
                            }
                        }).then(async () => {
                            await render_sft(ctx)
                        })

                        ctx.answerCbQuery()

                    }

                }

            }

            if (ctx.updateType === 'message') {

                // @ts-ignore
                if (ctx.message.text) {

                    // @ts-ignore
                    let text: string = ctx.message.text
                    let user_id: number = ctx.from.id

                    let translation: translation = {
                        sentence_russian: ctx.scene.session.sentence_id,
                        translate_text: text,
                        author: user_id,
                        votes: []
                    }

                    new Translation(translation).save().then(async (document) => {
                        await Sentence.findOneAndUpdate({
                            _id: new ObjectId(ctx.scene.session.sentence_id)
                        }, {
                            $push: {
                                translations: document._id.toString()
                            }
                        })
                    })

                } else {

                    await ctx.reply("Нужно отправить в текстовом виде")
                    await render_sft(ctx)

                }

            }

        } catch (err) {

            console.log(err)

        }
    }
}
async function add_translate_to_sentences(ctx: rlhubContext) {
    try {



    } catch (err) {

        console.log(err)

    }
}


// добавление предложений
sentences.action("add_sentence", async (ctx: rlhubContext) => await add_sentences(ctx))
async function add_sentences(ctx: rlhubContext) {
    ctx.answerCbQuery()
    ctx.wizard.selectStep(2)
    let message = `<b>Добавление перевода — Предложения</b>\n\n`
    message += `Отправьте список предложений на русском которые хотите добавить в базу данных для их перевода в дальнейшем`
    await ctx.editMessageText(message, {
        parse_mode: 'HTML', reply_markup: {
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
}
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
                                    translations: [],
                                    accepted: 'not view',
                                    skipped_by: []
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
                        translations: [],
                        accepted: 'not view',
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

// переход на главную
sentences.action("home", async (ctx) => {
    ctx.answerCbQuery()
    ctx.scene.enter('home')
})

// обработка входящих на сцене
handler.on("message", async (ctx) => await greeting(ctx))

export default sentences