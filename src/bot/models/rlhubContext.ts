import { ObjectId } from "mongoose";
import { Context, Scenes } from "telegraf";

interface rlhubWizardSession extends Scenes.WizardSessionData {
    sentence_id: string,
    amount: number,
    active_translation: string
}

interface rlhubSession extends Scenes.WizardSession<rlhubWizardSession> {
    sentences: string[];
    language: 'buryat-word' | 'russian-word';
}

interface rlhubContext extends Context {
    session: rlhubSession;
    scene: Scenes.SceneContextScene<rlhubContext, rlhubWizardSession>;
    wizard: Scenes.WizardContextWizard<rlhubContext>,
    update: any
}

export default rlhubContext