import { bot } from "../..";

async function set_webhook() {
    if (process.env.MODE === 'production') {
        bot.telegram.setWebhook(
            `${process.env.WEBHOOK_URL}/bot${process.env.BOT_TOKEN}`
        );
    } else {
        await fetch('http://localhost:4040/api/tunnels')
            .then((res: { json: () => any; }) => res.json())
            .then((json: { tunnels: any[]; }) => json.tunnels.find(tunnel => tunnel.proto === 'https'))
            .then((secureTunnel: { public_url: any; }) => bot.telegram.setWebhook(`${secureTunnel.public_url}/bot${process.env.BOT_TOKEN}`))
            .then(async (status: any) => {
                console.log(`webhook setted: ${status}`)
            })
    }
}

module.exports = set_webhook()