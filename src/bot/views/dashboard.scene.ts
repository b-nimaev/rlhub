import { Date } from "mongoose";
import { Composer, Scenes } from "telegraf";
import { ExtraEditMessageText, ExtraReplyMessage } from "telegraf/typings/telegram-types";
import { IPayment, Payment } from "../../models/IPayment";
import { IUser, User } from "../../models/IUser";
import rlhubContext from "../models/rlhubContext";
import format_money from "../utlis/format_money";
const QiwiBillPaymentsAPI = require('@qiwi/bill-payments-node-js-sdk');

const secret_key: string | undefined= process.env.secret_key;
const publicKey: string | undefined = process.env.public_key;

const qiwiApi = new QiwiBillPaymentsAPI(secret_key);

async function get_link_for_payment(ctx: rlhubContext, amount: number, billID: string, expirationDateTime: any) {
    try {

        const params = {
            amount: amount.toFixed(2),
            currency: 'RUB',
            account: `${ctx.from?.id}`,
            expirationDateTime: expirationDateTime,
            comment: 'На сохранение бурятского яызыка',
            email: 'alexandrbnimaev@yandex.ru',
            successUrl: `https://60da-5-136-245-89.eu.ngrok.io/payment/success?billId=${billID}`
        }

        let link = qiwiApi.createBill(billID, params)

        return link

    } catch (err) {

        console.log(err)

    }
}

const handler = new Composer<rlhubContext>();
const dashboard = new Scenes.WizardScene("dashboard", handler, 
    async (ctx) => await about_project(ctx), 
    async (ctx) => await help_handler(ctx)
);

async function greeting (ctx: rlhubContext) {
    try {
        let user: IUser | null = await User.findOne({ id: ctx.from?.id })

        if (user) {

            const extra: ExtraEditMessageText = {
                parse_mode: 'HTML',
                reply_markup: {
                    inline_keyboard: [
                        [
                            {
                                text: 'О проекте',
                                callback_data: 'about'
                            }
                        ], [
                            {
                                text: 'Настройки',
                                callback_data: 'common_settings'
                            }
                        ], [
                            {
                                text: 'Поддержка проекта',
                                callback_data: 'help'
                            }
                        ],
                        [
                            {
                                text: 'Справочные материалы',
                                callback_data: 'reference_materials'
                            }
                        ],
                        [
                            {
                                text: 'Назад',
                                callback_data: 'home'
                            },
                            {
                                text: 'Обратная связь',
                                callback_data: 'contact'
                            }
                        ],
                    ]
                }
            }

            let words = []
            let message: string = `<b>Личный кабинет</b> \n\nОбщий рейтинг: ${user.rating} \nДобавлено слов: 0 \nСлов на модерации: ${words.length} \nПереведено предложений: 0 \nДобавлено предложений: ${user.proposedProposals.length}`

            message += `\n\n<b>Внесено в проект ${format_money(user.supported)} ₽</b>`

            ctx.updateType === 'message' ? await ctx.reply(message, extra) : false
            ctx.updateType === 'callback_query' ? await ctx.editMessageText(message, extra) : false

        }

    } catch (err) {
        console.error(err);
    }
}

dashboard.enter(async (ctx: rlhubContext) => await greeting(ctx));

dashboard.action("common_settings", async (ctx) => {
    await ctx.answerCbQuery('Личный кабинет / Настройки')
    return ctx.scene.enter('settings')
})

async function about_project (ctx: rlhubContext) {
    
    try {

        if (ctx.updateType === 'callback_query') {
            if (ctx.callbackQuery) {

                // @ts-ignore
                if (ctx.callbackQuery.data) {

                    // @ts-ignore
                    let data: 'back' = ctx.callbackQuery.data

                    if (data === 'back') {
                        
                        ctx.wizard.selectStep(0)
                        await ctx.answerCbQuery()
                        await greeting(ctx)

                    }

                }

            }
        } else {
            about_project_section_render (ctx)
        }

    } catch (err) {
        
        console.log(err)

    }

}

dashboard.action("about", async (ctx) => await about_project_section_render (ctx))

async function about_project_section_render (ctx: rlhubContext) {
    try {
        
        let message: string = '<b>Личный кабинет — О проекте</b> \n\nНаш проект нацелен на развитие бурятского языка, который является важной частью культурного наследия Бурятии. \n\nМы стремимся сохранить и продвигать язык среди молодого поколения, создавая образовательные материалы и организуя языковые мероприятия. \n\nНаша цель - сохранить богатство бурятской культуры и ее языка для будущих поколений.'
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
            
            await ctx.editMessageText(message, extra)

            ctx.answerCbQuery()
            ctx.wizard.selectStep(1)

        } else {

            await ctx.reply(message, extra)

        }

    } catch (err) {
        console.log(err)
    }
}

handler.on("message", async (ctx) => await greeting(ctx))

dashboard.action('reference_materials', async (ctx) => {
    return ctx.answerCbQuery()
})

dashboard.action("help", async (ctx) => await help(ctx))
async function help(ctx: rlhubContext) {
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
            await ctx.editMessageText(message, extra)
        }

        ctx.wizard.selectStep(2)

    } catch (err) {

        console.log(err)

    }
}
async function help_handler (ctx: rlhubContext) {
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

                // @ts-ignore
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

dashboard.action("home", async (ctx) => {
    return ctx.scene.enter('home')
})

dashboard.action("contact", async (ctx) => {
    return ctx.answerCbQuery('Обратная связь')
})

export default dashboard