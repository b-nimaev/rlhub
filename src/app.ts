import 'dotenv/config';
import express from 'express';
import bodyParser from 'body-parser';
import { bot } from '.';
import { IUser, User } from './models/IUser';
import { IPayment, Payment } from './models/IPayment';
import { ObjectId } from 'mongodb';
const PORT = process.env.PORT || 3000;
const app = express();

app.use(bodyParser.json());

app.post(`/bot`, (req, res) => {
    console.log('handler')
    bot.handleUpdate(req.body, res);
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
app.get('/success', async (req, res) => {
    let billId: string = res.req.url.replace('/payment/success?billId=', '')
    console.log(billId)
})
app.get('/payment/success', async (req, res) => {

    // @ts-ignore
    let billId: string = res.req.url.replace('/payment/success?billId=', '')
    console.log(billId)
    let payment: IPayment | null = await Payment.findOne({
        _id: new ObjectId(billId)
    })

    let user: IUser | null = await User.findOne({
        id: payment?.user_id
    })

    if (user && payment) {

        await bot.telegram.sendSticker(user?.id, 'CAACAgIAAxkBAAEIRdBkHZukHX1iJJVPMeQmZvfKXRgfDQACiRkAAkHrwEvwxgiNPD3Rai8E')
        await bot.telegram.sendMessage(user?.id, 'Спасибо за внесенный платеж!', {
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
        })

        await User.findOneAndUpdate({
            id: user.id
        }, {
            $set: {
                supported: user.supported + payment.amount
            }
        })

    }

    res.redirect('https://t.me/burlive_bot')

})

module.exports = app