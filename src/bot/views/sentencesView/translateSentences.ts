import { ExtraEditMessageText } from "telegraf/typings/telegram-types"
import { Sentence } from "../../../models/ISentence"
import rlhubContext from "../../models/rlhubContext"
import greeting from "./greeting"
import render_sft from "./render_sft"

export default async function translate_sentences(ctx: rlhubContext) {
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
                ]
            }
        }

        extra.reply_markup?.inline_keyboard.push([{
            text: 'Начать',
            callback_data: 'start'
        }])

        await Sentence.find({ skipped_by: { $in: [ctx.from?.id] } }).then(async (docs) => {
            if (docs.length > 0) {
                extra.reply_markup?.inline_keyboard.push([{
                    text: `Сброс skipped(${docs.length})`,
                    callback_data: 'reset_skipped'
                }])
            }
        })

        extra.reply_markup?.inline_keyboard.push([{
            text: 'Назад',
            callback_data: 'back'
        }])

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

async function reset_skipped(ctx: rlhubContext) {
    try {

        await Sentence.updateMany({
            skipped_by: { $in: [ctx.from?.id] }
        }, {
            $pull: {
                skipped_by: ctx.from?.id
            }
        }).then(async () => {
            ctx.answerCbQuery('Пропущенные слова сброшены')
        }).catch(async () => {
            ctx.answerCbQuery('Возникла ошибка')
        })

    } catch (err) {

        console.log(err)

    }
}

export async function translate_sentences_handler(ctx: rlhubContext) {

    if (ctx.from) {
        try {

            if (ctx.updateType === 'callback_query') {

                // @ts-ignore
                if (ctx.callbackQuery.data) {

                    // @ts-ignore
                    let data: 'back' | 'start' | 'reset_skipped' = ctx.callbackQuery.data

                    if (data === 'back') {

                        await greeting(ctx)
                        ctx.wizard.selectStep(0)

                    }

                    if (data === 'start') {

                        await render_sft(ctx)

                    }

                    if (data === 'reset_skipped') {

                        await reset_skipped(ctx)
                        await translate_sentences(ctx)

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