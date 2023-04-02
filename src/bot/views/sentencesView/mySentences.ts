import { ObjectId } from "mongodb"
import { ExtraEditMessageText } from "telegraf/typings/telegram-types"
import { ISentence, Sentence } from "../../../models/ISentence"
import { IUser, User } from "../../../models/IUser"
import rlhubContext from "../../models/rlhubContext"
import greeting from "./greeting"
const timezone = 'Asia/Shanghai'; // ваш часовой пояс
export default async function my_sentences(ctx: rlhubContext) {
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

async function my_sentences_handler(ctx: rlhubContext) {

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
            await my_sentences(ctx)
        }

    } catch (err) {

        console.log(err)

    }

}

export { my_sentences_handler }