import { ObjectId } from "mongoose";
import { Context, Scenes } from "telegraf";

interface rlhubWizardSession extends Scenes.WizardSessionData {
    sentence_id: string,
    amount: number,
    active_translation: string,
    moderation_sentence: string,
    current_translation_for_vote: ObjectId
}

interface rlhubSession extends Scenes.WizardSession<rlhubWizardSession> {
    sentences: string[];
    language: 'buryat-word' | 'russian-word';
}

interface rlhubContext extends Context {
    session: rlhubSession;
    scene: Scenes.SceneContextScene<rlhubContext, rlhubWizardSession>;
    wizard: Scenes.WizardContextWizard<rlhubContext>,
    update: any,
    message: any
}

export default rlhubContext