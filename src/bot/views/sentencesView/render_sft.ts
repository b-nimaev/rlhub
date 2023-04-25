import { ExtraEditMessageText } from "telegraf/typings/telegram-types";
import { translation, ActiveTranslator, Sentence, Translation, ISentence } from "../../../models/ISentence";
import { User } from "../../../models/IUser";
import rlhubContext from "../../models/rlhubContext";
import get_tranlations from "./getTranslations";
import { render_sentencse_for_translate } from "./renderSentences";
import moment from 'moment-timezone';
const timezone = 'Asia/Shanghai'; // ваш часовой пояс
const now = moment().tz(timezone);
import fs from 'fs';
import { ObjectId } from "mongodb";
import translate_sentences from "./translateSentences";

export default async function render_sft(ctx: rlhubContext) {
    try {

        let message: string = `<b>Перевод предложений</b>\n\n`;
        let extra: ExtraEditMessageText = {
            parse_mode: 'HTML',
            reply_markup: {
                inline_keyboard: []
            }
        }

        // получение предложения которое нужно перевести
        // @ts-ignore
        let sentence: ISentence = await Sentence.aggregate([
            { $match: { skipped_by: { $ne: ctx.from?.id }, accepted: 'accepted' } },
            { $sort: { active_translator: 1 } },
            { $project: { text: 1, author: 1, accepted: 1, translations: 1, translations_length: { $size: "$translations" } } },
            { $sort: { translations_length: 1, active_translator: 1 } },
            { $limit: 1 }
        ]).then(async (doc) => {
            return doc[0]
        })

        console.log(sentence)

        // если он найден
        if (sentence) {

            await render_sentencse_for_translate(ctx, sentence).then((response: string) => {
                message += response
            })

            // Вернули объект, либо false
            let translations: {
                author_translation: translation[],
                common_translation: translation[]
            } | false = await get_tranlations(ctx, sentence)

            // Если объект существует
            if (translations) {

                if (translations.author_translation.length > 0) {

                    // Если у пользвателя ест переводы, добавим кнопку продолжить
                    extra.reply_markup?.inline_keyboard.push([{ text: 'Дальше', callback_data: 'continue' }])

                } else {

                    // Если и пользователя нет переводов, добавим кнопку пропустить
                    extra.reply_markup?.inline_keyboard.push([{ text: 'Пропустить', callback_data: 'skip' }])

                }

                await User.findOne({ id: ctx.from?.id }).then(async (user) => {

                    // Создаем документ активного переводчика
                    await new ActiveTranslator({ user_id: user?._id }).save().then(async (document) => {

                        // далее идентификатор созданного активного переводчика
                        // добавляем в массив active_translator в документе текущего Sentence
                        await Sentence.findOneAndUpdate({ _id: sentence._id }, { $push: { active_translator: document.id.toString() } }).then(async () => {

                            // айди созданного активного переводчика сохраняем в контекст бота
                            ctx.scene.session.active_translation = document.id.toString()

                            // устанавливаем таймер в 1 минуту
                            setTimeout(async () => {

                                // удаляем идентификатор активного переводчика из Sentence
                                await Sentence.findOneAndUpdate({ _id: sentence._id }, { $pull: { active_translator: document.id.toString() } }).then(async () => {
                                    
                                    // Запишем это в лог
                                    const message = `Активный переводчик ${document.id} удален из предложения ${sentence._id} at ${now.toISOString()}\n`;
                                    fs.appendFile('log.txt', message, (err) => {
                                        if (err) throw err;
                                    });

                                    await ActiveTranslator.findOneAndDelete({
                                        _id: new ObjectId(document.id)
                                    }).then(async () => {
                                        const message = `Документ активного переводчика ${document.id} удален`
                                        fs.appendFile('log.txt', message, (err) => {
                                            if (err) throw err;
                                        });
                                    })

                                }).catch(err => {
                                    
                                    // Типа обработки ошибки
                                    console.log(err)
                                
                                })
                            }, 60 * 1000);
                        })
                    })
                })

            }


        } else {

            // если предложений нет
            message += `Предложений не найдено`
            extra.reply_markup?.inline_keyboard.push([{ text: 'Добавить предложения', callback_data: 'add_sentence' }])

        }

        extra.reply_markup?.inline_keyboard.push([{ text: 'Назад', callback_data: 'back' }])

        if (ctx.updateType === 'callback_query') {
            ctx.answerCbQuery()
            return await ctx.editMessageText(message, extra).then(() => {
                ctx.scene.session.active_translation
            })
        } else {
            return await ctx.reply(message, extra).then(() => {
                ctx.scene.session.active_translation
            })
        }


    } catch (err) {

        console.log(err)

    }
}

// добавление перевода предложения
export async function add_translate_to_sentences_hander(ctx: rlhubContext) {
    if (ctx.from) {
        try {

            if (ctx.updateType === 'callback_query') {

                // @ts-ignore
                if (ctx.callbackQuery.data) {

                    // @ts-ignore
                    let data: 'back' | 'skip' | 'continue' = ctx.callbackQuery.data

                    if (data === 'back') {

                        await Sentence.findOneAndUpdate({
                            _id: new ObjectId(ctx.session.__scenes.sentence_id)
                        }, {
                            $pull: {
                                active_translator: ctx.scene.session.active_translation
                            }
                        }).then(async (doc) => {
                            if (doc) {
                                const message_log = `User ${ctx.from?.id} removed active translator by back ${ctx.scene.session.active_translation} from sentence ${doc._id} at ${moment().tz(timezone).toISOString()}\n`;
                                fs.appendFile('log.txt', message_log, (err) => {
                                    if (err) throw err;
                                });
                            }
                        })

                        await translate_sentences(ctx)

                    }

                    if (data === 'skip' || data === 'continue') {

                        await Sentence.findOneAndUpdate({
                            _id: new ObjectId(ctx.session.__scenes.sentence_id)
                        }, {
                            $push: {
                                skipped_by: ctx.from.id
                            },
                            $pull: {
                                active_translator: ctx.scene.session.active_translation
                            }
                        }).then(async (doc) => {
                            if (doc) {
                                const message_log = `User ${ctx.from?.id} removed active translator ${ctx.scene.session.active_translation} from sentence ${doc._id} at ${moment().tz(timezone).toISOString()}\n`;
                                fs.appendFile('log.txt', message_log, (err) => {
                                    if (err) throw err;
                                });

                                await ActiveTranslator.findOneAndDelete({
                                    _id: new ObjectId(ctx.scene.session.active_translation)
                                }).then(async () => {
                                    const message_log = `Документ активного переводчика ${ctx.from?.id} удален из предложения ${ctx.session.__scenes.sentence_id} ${now.toISOString()}\n`;
                                    fs.appendFile('log.txt', message_log, (err) => {
                                        if (err) throw err;
                                    });
                                })

                                await render_sft(ctx)
                            }
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
                        author: user_id
                    }

                    console.log(ctx.scene.session.active_translation)

                    new Translation(translation).save().then(async (document) => {
                        await Sentence.findOneAndUpdate({
                            _id: new ObjectId(ctx.scene.session.sentence_id)
                        }, {
                            $push: {
                                translations: document._id.toString()
                            },
                            $pull: {
                                active_translator: ctx.scene.session.active_translation
                            }
                        }).then(async () => {
                            const message_log = `User ${user_id} removed active translator ${document.id} from sentence ${ctx.scene.session.active_translation} at ${moment().tz(timezone).toISOString()}\n`;
                            fs.appendFile('log.txt', message_log, (err) => {
                                if (err) throw err;
                            });
                        })

                        await render_sft(ctx)
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