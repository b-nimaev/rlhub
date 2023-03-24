import { Context, Scenes } from "telegraf";

interface rlhubWizardSession extends Scenes.WizardSessionData {
    sentence_id: string
}

interface rlhubSession extends Scenes.WizardSession<rlhubWizardSession> {
    sentences: string[];
    language: 'buryat-word' | 'russian-word';
}

interface rlhubContext extends Context {
    session: rlhubSession;
    scene: Scenes.SceneContextScene<rlhubContext, rlhubWizardSession>;
    wizard: Scenes.WizardContextWizard<rlhubContext>
}

export default rlhubContext