import { ExtraEditMessageText } from "telegraf/typings/telegram-types"
import rlhubContext from "../../models/rlhubContext"
import format_money from "../../utlis/format_money"
import greeting from "./greeting"
import { IPayment, Payment } from "../../../models/IPayment";
const QiwiBillPaymentsAPI = require('@qiwi/bill-payments-node-js-sdk');

const secret_key: string | undefined = process.env.secret_key;
const publicKey: string | undefined = process.env.public_key;

const qiwiApi = new QiwiBillPaymentsAPI(secret_key);
export default async function help_handler(ctx: rlhubContext) {
    try {

        let message: string = `<b>Поддержка проекта 💰</b> \n\n`
        // await get_link_for_payment(ctx)
        message += `Введите желаемую сумму в рублях для поддержки проекта\n\n`

        message += `Минимальная сумма: 1 ₽\n`
        message += `Максимальная сумма: 60 000 ₽`

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

        if (ctx.updateType === 'callback_query') {

            // @ts-ignore
            if (ctx.callbackQuery.data) {

                // @ts-ignore
                let data: 'back' = ctx.callbackQuery.data

                if (data === 'back') {

                    ctx.wizard.selectStep(0)
                    ctx.answerCbQuery()
                    await greeting(ctx)
                }

            }

        }

        if (ctx.updateType === 'message') {
            let amount: number = 0

            // @ts-ignore
            if (ctx.message.text) {

                // @ts-ignore
                if (parseFloat(ctx.message.text) > 0 && parseFloat(ctx.message.text) < 60000) {

                    // @ts-ignore
                    amount = parseFloat(ctx.message.text)

                    // @ts-ignore
                } else if (parseFloat(ctx.message.text) > 60000) {
                    amount = 60000
                }

            }

            ctx.scene.session.amount = amount
            let amount_message: string = `<b>Поддержка проекта 💰</b> \n\n`

            if (amount) {

                const currentDate = new Date();
                const futureDate = (currentDate.getTime() + 0.2 * 60 * 60 * 1000);

                let payment: IPayment = await new Payment({
                    user_id: ctx.from?.id,
                    amount: ctx.scene.session.amount,
                    expirationDateTime: futureDate as unknown as Date
                }).save()

                console.log(payment)
                let link: any = await get_link_for_payment(ctx, ctx.scene.session.amount, payment._id.toString(), payment.expirationDateTime)
                amount_message += `Счёт сформирован на сумму ${format_money(ctx.scene.session.amount)} ₽\n`
                await ctx.reply(amount_message, {
                    parse_mode: 'HTML',
                    reply_markup: {
                        inline_keyboard: [
                            [
                                {
                                    text: 'Оплатить',
                                    url: link.payUrl
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
                await ctx.reply(message, extra)
            }

        }

    } catch (err) {

        console.log(err)

    }
}

async function get_link_for_payment(ctx: rlhubContext, amount: number, billID: string, expirationDateTime: any) {
    try {

        const params = {
            amount: amount.toFixed(2),
            currency: 'RUB',
            account: `${ctx.from?.id}`,
            expirationDateTime: expirationDateTime,
            comment: 'На сохранение бурятского яызыка',
            email: 'alexandrbnimaev@yandex.ru',
            successUrl: `https://5491-95-188-237-196.ngrok-free.app/payment/success?billId=${billID}`
        }

        let link = qiwiApi.createBill(billID, params)

        return link

    } catch (err) {

        console.log(err)

    }
}