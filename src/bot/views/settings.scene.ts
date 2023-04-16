import { Composer, Scenes } from "telegraf";
import rlhubContext from "../models/rlhubContext";
import greeting from "./settingsView/greeting";
import date_birth_handler, { date_birth } from "./settingsView/date_of_birth";

const handler = new Composer<rlhubContext>();
const settings = new Scenes.WizardScene("settings", handler,
    async (ctx: rlhubContext) => await date_birth_handler(ctx)
);

settings.enter(async (ctx: rlhubContext) => await greeting(ctx));

handler.on("message", async (ctx) => await greeting(ctx))

handler.action("back", async (ctx) => {
    await ctx.answerCbQuery()
    return ctx.scene.enter("dashboard")
})

settings.action("choose_ln", async (ctx) => {
    return ctx.answerCbQuery()
})

settings.action("choose_gender", async (ctx) => {
    return ctx.answerCbQuery()
})

settings.action("date_birth", async (ctx: rlhubContext) => await date_birth(ctx))

export default settings