import { Composer, Scenes } from "telegraf";
import { ExtraEditMessageText } from "telegraf/typings/telegram-types";
import rlhubContext from "../models/rlhubContext";
import greeting from "./dashboardView/greeting";
import help_handler from "./dashboardView/helpHandler";

const handler = new Composer<rlhubContext>();
const dashboard = new Scenes.WizardScene("dashboard", handler, 
    async (ctx) => await about_project(ctx), 
    async (ctx) => await help_handler(ctx)
);

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

dashboard.action("home", async (ctx) => {
    return ctx.scene.enter('home')
})

dashboard.action("contact", async (ctx) => {
    return ctx.answerCbQuery('Обратная связь')
})

export default dashboard