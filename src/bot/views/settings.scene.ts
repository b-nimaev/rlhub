import { Composer, Scenes } from "telegraf";
import rlhubContext from "../models/rlhubContext";

const handler = new Composer<rlhubContext>();
const settings = new Scenes.WizardScene("settings", handler);

settings.enter(async (ctx) => {
    console.log("user enter on settings")
})

export default settings