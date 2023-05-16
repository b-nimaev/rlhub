import { Composer, Scenes } from "telegraf";
import { Translation, voteModel } from "../../models/ISentence";
import rlhubContext from "../models/rlhubContext";
import { User } from "../../models/IUser";
import greeting from "./moderationView/greeting";

// handlers and renders 
import moderation_translates, { render_vote_sentence } from "./moderationView/moderationTranslates";
import { moderation_sentences, updateSentence } from "./moderationView/moderationSentencesHandler";

const handler = new Composer<rlhubContext>();
const moderation = new Scenes.WizardScene("moderation", handler,
    async (ctx: rlhubContext) => moderation_sentences_handler(ctx),
    async (ctx: rlhubContext) => moderation_translates_handler(ctx));

moderation.enter(async (ctx: rlhubContext) => await greeting(ctx));

moderation.action("moderation_sentences", async (ctx) => await moderation_sentences(ctx))

async function moderation_sentences_handler(ctx: rlhubContext) {
    try {
        
        let update = ctx.updateType

        if (update === 'callback_query') {

            let data: 'back' | 'good' | 'bad' = ctx.update.callback_query.data

            if (data === 'back') {
                ctx.wizard.selectStep(0)
                await greeting(ctx)
            }

            if (data === 'good') {
                await updateSentence(ctx, 'accepted')
            }

            if (data === 'bad') {
                await updateSentence(ctx, 'declined')
            }

            ctx.answerCbQuery()

        }

    } catch (err) {
        console.log(err)
    }
}

moderation.action("moderation_translates", async (ctx) => await moderation_translates(ctx))
// обрабатываем голос
async function moderation_translates_handler(ctx: rlhubContext) {
    if (ctx.updateType === 'callback_query') {


        // сохраняем коллбэк
        let data: 'back' | 'addTranslate' | 'good' | 'bad' | 'skip' = ctx.update.callback_query.data
        let translate_id = ctx.scene.session.current_translation_for_vote

        let user = await User.findOne({ id: ctx.from?.id })

        if (data === 'good') {

            // Сохраняем голос +
            await new voteModel({ user_id: user?._id, translation_id: translate_id, vote: true }).save().then(async (data) => {

                // Возвращаем _id сохранненого голоса
                let vote_id = data._id

                // пушим в массив голосов докумена перевода
                await Translation.findOneAndUpdate({ _id: translate_id }, { $push: { votes: vote_id } })
                await User.findOneAndUpdate({ _id: user?._id }, { $addToSet: { voted_translations: translate_id } })
            })
            await render_vote_sentence(ctx)

        } else if (data === 'bad') {

            // сохраняем голос -
            await new voteModel({ user_id: user?._id, translation_id: translate_id, vote: false }).save().then(async (data) => {

                // вернули айдишку
                let vote_id = data._id

                // сохранили айдишку в документе перевода
                await Translation.findOneAndUpdate({ _id: translate_id }, { $push: { votes: vote_id } })
                await User.findOneAndUpdate({ _id: user?._id }, { $addToSet: { voted_translations: translate_id } })
            })
            await render_vote_sentence(ctx)

        }

        // Если чел хочет вернутьтся на начальный экран модерации
        if (data === 'back') {

            ctx.wizard.selectStep(0)
            await greeting(ctx)

        }

        ctx.answerCbQuery()

    } else {

        await render_vote_sentence(ctx)

    }
}

moderation.action("moderation_vocabular", async (ctx) => {
    ctx.answerCbQuery('Модерация словаря в разработке')
})

handler.on("message", async (ctx) => await greeting(ctx))

handler.action("back", async (ctx) => {
    await ctx.answerCbQuery()
    return ctx.scene.enter("home")
})

export default moderation