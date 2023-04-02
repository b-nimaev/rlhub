import { ObjectId } from "mongodb"
import { ISentence, translation, Translation } from "../../../models/ISentence"
import rlhubContext from "../../models/rlhubContext"

export default async function get_tranlations(ctx: rlhubContext, sentence: ISentence) {
    try {

        let author_translation: translation[] = []
        let common_translation: translation[] = []
        for (let i = 0; i < sentence.translations.length; i++) {

            let translation: translation | null = await Translation.findOne({
                _id: new ObjectId(sentence.translations[i])
            })

            if (translation) {

                if (translation.author === ctx.from?.id) {

                    author_translation.push(translation)

                } else {

                    common_translation.push(translation)

                }

            }

        }

        return {
            author_translation,
            common_translation
        }


    } catch (err) {

        return false

    }
}