import { Composer, Scenes } from "telegraf";
import { ExtraEditMessageText, ExtraReplyMessage } from "telegraf/typings/telegram-types";
import { IUser, User } from "../../models/IUser";
import rlhubContext from "../models/rlhubContext";

const handler = new Composer<rlhubContext>();
const dashboard = new Scenes.WizardScene("dashboard", handler, async (ctx) => await about_project(ctx));

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
            let message = `<b>Личный кабинет</b> \n\nОбщий рейтинг: ${user.rating} \nДобавлено слов: 0 \nСлов на модерации: ${words.length} \nПереведено предложений: 0 \nДобавлено предложений: ${user.proposedProposals.length}`

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

dashboard.action("help", async (ctx) => {
    return ctx.answerCbQuery('Помощь проекту')
})

dashboard.action("home", async (ctx) => {
    return ctx.scene.enter('home')
})

dashboard.action("contact", async (ctx) => {
    return ctx.answerCbQuery('Обратная связь')
})

export default dashboard