import { Context, Scenes } from "telegraf";

interface rlhubWizardSession extends Scenes.WizardSessionData {

}

interface rlhubSession extends Scenes.WizardSession<rlhubWizardSession> {

}

interface rlhubContext extends Context {
    session: rlhubSession;
    scene: Scenes.SceneContextScene<rlhubContext, rlhubWizardSession>;
    wizard: Scenes.WizardContextWizard<rlhubContext>
}

export default rlhubContext